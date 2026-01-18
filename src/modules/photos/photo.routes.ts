import { Router } from 'express';
import { ensureAuthenticated } from '../auth/middlewares/auth.middleware';
import { PhotoController } from './controllers/photo.controller';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from '@/shared/errors/AppError';
import { upload } from '@/infra/multer/upload';

const photosRoutes = Router();
const controller = new PhotoController();

photosRoutes.use(ensureAuthenticated);
photosRoutes.delete('/:id', controller.deletePhoto.bind(controller));
photosRoutes.post('/upload', upload.single('file'), controller.uploadPhoto.bind(controller));

photosRoutes.get(
  '/images/:filename',
  ensureAuthenticated,
  async (req, res) => {
    const filename = path.basename(req.params.filename);

    const uploadRoot =
      process.env.UPLOAD_DIR ??
      path.resolve(process.cwd(), 'uploads');

    const filePath = path.join(
      uploadRoot,
      'users',
      req.user!.id,
      'photos',
      filename
    );

    try {
      await fs.access(filePath);
      return res.sendFile(filePath);
    } catch {
      throw new AppError('Image not found', 404);
    }
  }
);

export { photosRoutes };

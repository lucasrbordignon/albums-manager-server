import { Router } from 'express';
import { ensureAuthenticated } from '../auth/middlewares/auth.middleware';
import { PhotoController } from './controllers/photo.controller';
import { upload } from '@/infra/multer/upload';

const photosRoutes = Router();
const controller = new PhotoController();

photosRoutes.use(ensureAuthenticated);
photosRoutes.delete('/:id', controller.deletePhoto.bind(controller));
photosRoutes.post('/upload', upload.single('file'), controller.uploadPhoto.bind(controller));

export { photosRoutes };
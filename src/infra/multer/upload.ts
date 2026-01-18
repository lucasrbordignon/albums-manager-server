import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { AppError } from '@/shared/errors/AppError';

const uploadRoot =
  process.env.UPLOAD_DIR ??
  path.resolve(process.cwd(), 'uploads');

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      if (!req.user?.id) {
        return cb(new AppError('Unauthorized upload', 401), '');
      }

      const uploadPath = path.join(
        uploadRoot,
        'users',
        req.user.id,
        'photos'
      );

      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error as Error, '');
    }
  },

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter(_, file, cb) {
    console.log('Entrou no uploadPhoto');
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new AppError('Invalid file type. Only images allowed', 400)
      );
    }
    cb(null, true);
  },
});

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
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'image/tiff',
  'image/heic',
  'image/heif',
  'image/avif',
];

export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      if (!req.user?.id) {
        return cb(new AppError('Upload não autorizado', 401), '');
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
  fileFilter(req, file, cb) {
    console.log('Mimetype recebido:', file.mimetype, 'Nome:', file.originalname);
    const isWebpByExt = file.originalname.toLowerCase().endsWith('.webp');
    if (
      !allowedMimeTypes.includes(file.mimetype) &&
      !(isWebpByExt && file.mimetype === 'application/octet-stream')
    ) {
      const err = new AppError('Tipo de arquivo inválido. Apenas imagens são permitidas', 400);
      (cb as any)(err, false);
    } else {
      cb(null, true);
    }
  },
});

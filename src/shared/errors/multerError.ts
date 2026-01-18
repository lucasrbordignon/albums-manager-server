import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '@/shared/errors/AppError';

export function multerError(
  err: Error,
  _: Request,
  __: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    return next(new AppError(err.message, 400));
  }

  if (err) {
    return next(err);
  }

  next();
}

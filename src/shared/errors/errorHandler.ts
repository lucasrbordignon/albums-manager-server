import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown | null;
};

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  if (err instanceof AppError) {
    const appErr = err as AppError;
    return res.status(appErr.statusCode).json({
      success: false,
      message: appErr.message,
      data: null,
      errors: appErr.errors ?? null,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    data: null,
    errors: null,
  });
}
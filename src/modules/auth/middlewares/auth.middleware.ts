import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '@/config/env';
import { AppError } from '@/shared/errors/AppError';

interface TokenPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new AppError('Token format invalid', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    
    req.user = {
      id: decoded.sub,
    };

    console.log('Authenticated user:', req.user);
    return next();
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  } 
}

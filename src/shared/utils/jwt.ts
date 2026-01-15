import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export function generateToken(
  payload: jwt.JwtPayload,
  expiresIn: SignOptions['expiresIn'] = '15m'
): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

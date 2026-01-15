import { AppError } from '../../../shared/errors/AppError';
import { generateToken } from '../../../shared/utils/jwt';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

export class RefreshTokenUseCase {
  constructor(private refreshRepo: RefreshTokenRepository) {}

  async execute(refreshToken: string) {
    const stored = await this.refreshRepo.findByToken(refreshToken);

    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const newAccessToken = generateToken({ sub: stored.userId });
    return { token: newAccessToken };
  }
}

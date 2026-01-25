import { AppError } from '@/shared/errors/AppError';
import { IUserRepository } from '@/shared/interfaces/IUserRepository';
import { generateRefreshToken } from '@/shared/utils/generateRefreshToken';
import { comparePassword } from '@/shared/utils/hash';
import { generateToken } from '@/shared/utils/jwt';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

interface LoginRequest {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute({ email, password }: LoginRequest) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new AppError('E-mail inválido', 401);
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Senha inválida', 401);
    }

    const token = generateToken({ sub: user.id, userId: user.id });

    const { token: refreshToken, expiresAt } = generateRefreshToken(user.id);
    const refreshRepo = new RefreshTokenRepository();

    await refreshRepo.create(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken: token,
      refreshToken,
    };
  }
}

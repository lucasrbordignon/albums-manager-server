import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { UserRepository } from '../repositories/user.repository';
import { LoginUseCase } from '../use-cases/login-use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token-use-case';
import { RegisterUseCase } from '../use-cases/register-use-case';
import { ResetPasswordUseCase } from '../use-cases/reset-password-use-case';
import { ForgotPasswordUseCase } from '../use-cases/forgot-password-use-case';
import { NodemailerEmailService } from '@/infra/email/NodemailerEmailService';
import { RedisPasswordResetTokenRepository } from '@/infra/redis/RedisPasswordResetTokenRepository';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    const registerBodySchema = z.object({
      name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
      email: z.string().email({ message: 'E-mail inválido' }),
      password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
    });
    const resultRegisterBodySchema = registerBodySchema.safeParse(req.body);
    if (!resultRegisterBodySchema.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        data: null,
        errors: resultRegisterBodySchema.error.errors.map(error => ({
          field: error.path[0],
          message: error.message,
        })),
      });
    }
    const { name, email, password } = resultRegisterBodySchema.data;
    const userRepository = new UserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);
    try {
      const result = await registerUseCase.execute({ name, email, password });
      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result,
        errors: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const loginBodySchema = z.object({
      email: z.string().email({ message: 'E-mail inválido' }),
      password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
    });
    const resultLoginBodySchema = loginBodySchema.safeParse(req.body);
    if (!resultLoginBodySchema.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        data: null,
        errors: resultLoginBodySchema.error.errors.map(error => ({
          field: error.path[0],
          message: error.message,
        })),
      });
    }
    const { email, password } = resultLoginBodySchema.data;
    const userRepository = new UserRepository();
    const loginUseCase = new LoginUseCase(userRepository);
    try {
      const result = await loginUseCase.execute({ email, password });
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result,
        errors: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response) {
    const schema = z.object({ refreshToken: z.string().uuid() });
    const resultSchema = schema.safeParse(req.body);
    if (!resultSchema.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        data: null,
        errors: resultSchema.error.errors.map(error => ({
          field: error.path[0],
          message: error.message,
        })),
      });
    }
    const { refreshToken } = resultSchema.data;
    const repo = new RefreshTokenRepository();
    const useCase = new RefreshTokenUseCase(repo);
    try {
      const result = await useCase.execute(refreshToken);
      return res.status(200).json({
        success: true,
        message: 'Token atualizado com sucesso',
        data: result,
        errors: null,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido',
        data: null,
        errors: [{ field: 'refreshToken', message: 'Token inválido ou expirado' }],
      });
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const registerBodySchema = z.object({
      email: z.string().email({ message: 'E-mail inválido' }),
    });
    const resultRegisterBodySchema = registerBodySchema.safeParse(req.body);
    if (!resultRegisterBodySchema.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        data: null,
        errors: resultRegisterBodySchema.error.errors.map(error => ({
          field: error.path[0],
          message: error.message,
        })),
      });
    }
    const { email } = resultRegisterBodySchema.data;
    const userRepository = new UserRepository();
    const passwordResetTokenRepository = new RedisPasswordResetTokenRepository();
    const emailService = new NodemailerEmailService();
    const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, passwordResetTokenRepository, emailService);
    try {
      const { expiresAt } = await forgotPasswordUseCase.execute({ email });
      return res.status(201).json({
        success: true,
        message: 'Token de recuperação enviado com sucesso',
        data: { expiresAt },
        errors: null,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar token de recuperação',
        data: null,
        errors: [{ field: 'email', message: 'Erro interno ao enviar e-mail' }],
      });
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      email: z.string().email({ message: 'E-mail inválido' }),
      otp: z.string().length(6),
      password: z.string().min(6),
    });
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        data: null,
        errors: result.error.errors.map(error => ({
          field: error.path[0],
          message: error.message,
        })),
      });
    }
    const { email, otp, password } = result.data;
    const userRepo = new UserRepository();
    const tokenRepo = new RedisPasswordResetTokenRepository();
    const useCase = new ResetPasswordUseCase(userRepo, tokenRepo);
    try {
      await useCase.execute({ email, otp, newPassword: password });
      return res.status(200).json({
        success: true,
        message: 'Senha atualizada com sucesso',
        data: null,
        errors: null,
      });
    } catch (error: any) {
      return res.status(error?.statusCode || 400).json({
        success: false,
        message: error?.message || 'Erro ao atualizar senha',
        data: null,
        errors: [{ field: 'otp', message: error?.message || 'Token inválido ou expirado' }],
      });
    }
  }
}


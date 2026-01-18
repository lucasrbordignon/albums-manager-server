import crypto from "crypto";
import { AppError } from "@/shared/errors/AppError";
import { IUserRepository } from "@/shared/interfaces/IUserRepository";
import { IPasswordResetTokenRepository } from "@/shared/interfaces/IPasswordResetTokenRepository";
import { hashPassword } from "@/shared/utils/hash";
import { hashOtp } from "@/shared/utils/hashOtp";

interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private userRepo: IUserRepository,
    private tokenRepo: IPasswordResetTokenRepository,
  ) {}

  async execute({ email, otp, newPassword }: ResetPasswordRequest): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    const storedHashedToken = await this.tokenRepo.find(user.id);
    if (!storedHashedToken) {
      throw new AppError("Token inválido ou expirado", 400);
    }
    const incomingHashedToken = hashOtp(otp);
    if (storedHashedToken !== incomingHashedToken) {
      throw new AppError("Token inválido ou expirado", 400);
    }
    const passwordHash = await hashPassword(newPassword);
    await this.userRepo.updatePassword(user.id, passwordHash);
    await this.tokenRepo.delete(user.id);
  }
}

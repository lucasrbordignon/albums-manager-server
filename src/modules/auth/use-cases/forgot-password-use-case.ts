import { RedisPasswordResetTokenRepository } from "@/infra/redis/RedisPasswordResetTokenRepository";
import { IEmailService } from "@/shared/interfaces/IEmailService";
import { IUserRepository } from "@/shared/interfaces/IUserRepository";
import { generateOTP } from "@/shared/utils/generateOTP";
import { hashOtp } from "@/shared/utils/hashOtp";

interface ForgotPasswordRequest {
	email: string;
}

export class ForgotPasswordUseCase {
	constructor(
		private userRepository: IUserRepository,
		private tokenRepository: RedisPasswordResetTokenRepository,
		private emailService: IEmailService,
	) {}

	async execute({ email }: ForgotPasswordRequest): Promise<{ expiresAt: Date }> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			return { expiresAt: new Date() };
		}

		const otp = generateOTP(6);
		const hashedOtp = hashOtp(otp);

		const OTP_TTL = 300;
		const expirationDate = new Date(Date.now() + OTP_TTL * 1000);

		await this.tokenRepository.save(
			user.id,
			hashedOtp,
			OTP_TTL
		);
		await this.emailService.sendResetPasswordEmail(
			email,
			otp,
			expirationDate
		);

		return { expiresAt: expirationDate };
	}
}

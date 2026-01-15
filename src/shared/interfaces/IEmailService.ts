export interface IEmailService {
	sendResetPasswordEmail(
		email: string,
		otp: string,
		expiresAt: Date
	): Promise<void>;
}
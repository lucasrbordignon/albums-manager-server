export interface IPasswordResetTokenRepository {
	save(userId: string, otp: string, ttlSeconds: number): Promise<void>;
	find(userId: string): Promise<string | null>;
	delete(userId: string): Promise<void>;
}
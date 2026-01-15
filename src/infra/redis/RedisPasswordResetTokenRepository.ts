import Redis from "ioredis";
import { IPasswordResetTokenRepository } from "../../shared/interfaces/IPasswordResetTokenRepository";

export class RedisPasswordResetTokenRepository
	implements IPasswordResetTokenRepository
{
	private redis = new Redis();

	async save(userId: string, otp: string, ttlSeconds: number): Promise<void> {
		await this.redis.set(
			`password-reset:${userId}`,
			otp,
			"EX",
			ttlSeconds
		);
	}

	async find(userId: string): Promise<string | null> {
		return this.redis.get(`password-reset:${userId}`);
	}

	async delete(userId: string): Promise<void> {
		await this.redis.del(`password-reset:${userId}`);
	}
}
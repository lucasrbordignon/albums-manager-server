import IORedis from 'ioredis';

export const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB ?? 0),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
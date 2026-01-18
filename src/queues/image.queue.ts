import { ConnectionOptions, Queue } from 'bullmq';
import { redis } from '@/config/redis';

export const imageQueue = new Queue('image-processing', {
  connection: redis as unknown as ConnectionOptions,
});
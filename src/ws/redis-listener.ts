import { redis } from '@/config/redis';
import { getIO } from './socket';

export function startRedisListener() {
  const subscriber = redis.duplicate();

  subscriber.subscribe('photo:processed');

  subscriber.on('message', (_, message) => {
    const { userId, photo } = JSON.parse(message);

    const io = getIO();

    io.to(`user:${userId}`).emit('photo:processed', photo);
  });
}
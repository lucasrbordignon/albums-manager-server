import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

export function generateRefreshToken(userId: string) {
  const token = randomUUID();
  const expiresAt = dayjs().add(7, 'days').toDate();

  return { token, expiresAt };
}

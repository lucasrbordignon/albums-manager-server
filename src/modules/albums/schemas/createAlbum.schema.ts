import { z } from 'zod';

export const createAlbumSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  userId: z.string().uuid(),
});
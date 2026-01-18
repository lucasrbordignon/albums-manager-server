import { z } from 'zod';

export const createAlbumSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  userId: z.string().uuid(),
});
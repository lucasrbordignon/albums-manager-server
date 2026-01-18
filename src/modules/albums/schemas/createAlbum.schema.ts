import { z } from 'zod';

export const createAlbumSchema = z.object({
  title: z.string(),
  description: z.string(),
  userId: z.string().uuid(),
});
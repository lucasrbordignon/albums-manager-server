import { z } from 'zod';

export const updateAlbumSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
  })
  .partial();

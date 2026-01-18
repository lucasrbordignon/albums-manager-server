import { z } from 'zod';

export const updateAlbumSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
  })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field must be provided to update the album',
    },
  );

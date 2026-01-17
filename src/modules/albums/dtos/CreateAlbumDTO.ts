import { z } from "zod";
import { createAlbumSchema } from "../schemas/createAlbum.schema";

export type CreateAlbumDTO = z.infer<typeof createAlbumSchema>;
import { z } from "zod";
import { updateAlbumSchema } from "../schemas/updateAlbum.schema";

export type UpdateAlbumDTO = z.infer<typeof updateAlbumSchema>;
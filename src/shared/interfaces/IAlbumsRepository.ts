import { Album } from "@/generated/prisma/client";
import { CreateAlbumDTO } from "@/modules/albums/dtos/CreateAlbumDTO";
import { UpdateAlbumDTO } from "@/modules/albums/dtos/UpdateAlbumDTO";

export interface IAlbumsRepository {
  create(data: CreateAlbumDTO): Promise<Album>;

  update(id: string, data: Partial<UpdateAlbumDTO>): Promise<Album>;

  findById(id: string): Promise<Album | null>;

  findByUserId(userId: string): Promise<Album[]>;

  findByTitleAndUserId(title: string, userId: string): Promise<Album | null>;

  softDelete(id: string): Promise<void>;
}

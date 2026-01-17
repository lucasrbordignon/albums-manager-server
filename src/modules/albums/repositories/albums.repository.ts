import { prisma } from "@/lib/prisma";
import { IAlbumsRepository } from "@/shared/interfaces/IAlbumsRepository";
import { CreateAlbumDTO } from "../dtos/CreateAlbumDTO";
import { Album } from "../entities/Album";
import { UpdateAlbumDTO } from "../dtos/UpdateAlbumDTO";

export class AlbumsRepository implements IAlbumsRepository {
  async create(data: CreateAlbumDTO): Promise<Album> {
    return await prisma.albums.create({data});
  }

  async update(id: string, data: Partial<UpdateAlbumDTO>): Promise<Album> {
    return prisma.albums.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Album | null> {
    return prisma.albums.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByUserId(userId: string): Promise<Album[]> {
    return prisma.albums.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.albums.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findByTitleAndUserId(title: string, userId: string): Promise<Album | null> {
    return prisma.albums.findFirst({
      where: {
        title,
        userId,
        deletedAt: null,
      },
    });
  }
}

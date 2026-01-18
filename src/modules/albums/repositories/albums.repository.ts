import { prisma } from "@/lib/prisma";
import { IAlbumsRepository } from "@/shared/interfaces/IAlbumsRepository";
import { CreateAlbumDTO } from "../dtos/CreateAlbumDTO";
import { UpdateAlbumDTO } from "../dtos/UpdateAlbumDTO";
import { Album } from "@/generated/prisma/client";

export class AlbumsRepository implements IAlbumsRepository {
  async create(data: CreateAlbumDTO): Promise<Album> {
    return await prisma.album.create({data});
  }

  async update(id: string, data: Partial<UpdateAlbumDTO>): Promise<Album> {
    return prisma.album.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Album | null> {
    return prisma.album.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByUserId(userId: string): Promise<Album[]> {
    return prisma.album.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.album.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findByTitleAndUserId(title: string, userId: string): Promise<Album | null> {
    return prisma.album.findFirst({
      where: {
        title,
        userId,
        deletedAt: null,
      },
    });
  }
}

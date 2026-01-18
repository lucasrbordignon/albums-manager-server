import { CreatePhotoDTO } from '@/modules/photos/dtos/CreatePhotoDTO'
import { prisma } from '@/lib/prisma'
import { IPhotosRepository } from '@/shared/interfaces/IPhotosRepository'
import { PaginatedResponse } from '@/shared/interfaces/IPaginatedResponse'
import { PaginationParams } from '@/shared/interfaces/IPaginationParams'
import { Photo } from '@/generated/prisma/client'

export class PhotosRepository implements IPhotosRepository {
  async create(data: CreatePhotoDTO): Promise<Photo> {
    return prisma.photo.create({
      data: {
        ...data,
        hash: data.hash ?? '',
        description: data.description ?? null
      }
    })
  }

  async findById(photoId: string): Promise<Photo | null> {
    return prisma.photo.findFirst({
      where: {
        id: photoId,
        deletedAt: null
      }
    })
  }

  async softDelete(photoId: string): Promise<void> {
    await prisma.photo.update({
      where: {
        id: photoId
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async findByHash(hash: string): Promise<Photo | null> {
    return prisma.photo.findFirst({
      where: {
        hash,
        deletedAt: null
      }
    })
  }

  async findManyByAlbum(
    albumId: string,
    { page, limit }: PaginationParams
  ): Promise<PaginatedResponse<Photo>> {
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.photo.findMany({
        where: {
          albumId,
          deletedAt: null
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.photo.count({
        where: {
          albumId,
          deletedAt: null
        }
      })
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

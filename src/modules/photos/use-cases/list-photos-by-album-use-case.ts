import { AppError } from "@/shared/errors/AppError"
import { IAlbumsRepository } from "@/shared/interfaces/IAlbumsRepository"
import { IPhotosRepository } from "@/shared/interfaces/IPhotosRepository"

interface Request {
  albumId: string
  page: number
  limit: number
}

export class ListPhotosByAlbumUseCase {
  constructor(private photosRepository: IPhotosRepository, private albumsRepository: IAlbumsRepository) {}

  async execute({ albumId, page, limit }: Request) {
    if (!albumId) {
      throw new AppError('Album ID is required', 400)
    }

    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new AppError('Album not found', 404)
    }

    if (page < 1 || limit < 1) {
      throw new AppError('Invalid pagination params', 400)
    }

    return this.photosRepository.findManyByAlbum(albumId, {
      page,
      limit
    })
  }
}

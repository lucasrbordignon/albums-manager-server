import { AppError } from '@/shared/errors/AppError';
import { IAlbumsRepository } from '@/shared/interfaces/IAlbumsRepository';

interface FindAlbumByIdRequest {
  albumId: string;
}

export class FindAlbumByIdUseCase {
  constructor(private albumsRepository: IAlbumsRepository) {}

  async execute({ albumId }: FindAlbumByIdRequest) {
    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new AppError('Album not found', 404);
    }

    return album;
  }
}

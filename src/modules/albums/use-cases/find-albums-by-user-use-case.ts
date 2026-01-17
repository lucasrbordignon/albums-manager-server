import { AppError } from '@/shared/errors/AppError';
import { IAlbumsRepository } from '@/shared/interfaces/IAlbumsRepository';

interface FindAlbumsByUserIdRequest {
  userId: string;
}

export class FindAlbumsByUserIdUseCase {
  constructor(private albumsRepository: IAlbumsRepository) {}

  async execute({ userId }: FindAlbumsByUserIdRequest) {
    const albums = await this.albumsRepository.findByUserId(userId);
    
    if (!albums || albums.length === 0) {
      throw new AppError('Albums not found', 404);
    }

    return albums;
  }
}

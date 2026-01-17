import { IAlbumsRepository } from '@/shared/interfaces/IAlbumsRepository';
import { UpdateAlbumDTO } from '../dtos/UpdateAlbumDTO';
import { AppError } from '@/shared/errors/AppError';


export class UpdateAlbumUseCase {
  constructor(private albumsRepository: IAlbumsRepository) {}

  async execute(data: UpdateAlbumDTO, albumId: string) {
    const albumExists = await this.albumsRepository.findById(albumId);

    if (!albumExists) {
      throw new AppError('Album not found', 404);
    }

    const album = await this.albumsRepository.update(albumId, data);

    if (!album) {
      throw new AppError('Failed to update album', 500);
    }

    return { album };
  }
}

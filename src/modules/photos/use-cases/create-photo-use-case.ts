import { IAlbumsRepository } from '@/shared/interfaces/IAlbumsRepository';
import { AppError } from '@/shared/errors/AppError';
import { CreatePhotoDTO } from '../dtos/CreatePhotoDTO';
import { IPhotosRepository } from '@/shared/interfaces/IPhotosRepository';

export class CreatePhotoUseCase {
  constructor(private photosRepository: IPhotosRepository, private albumsRepository: IAlbumsRepository) {}

  async execute(data: CreatePhotoDTO) {
    if (data.albumId) {
      const album = await this.albumsRepository.findById(data.albumId);

      if (!album) {
        throw new AppError('Album not found', 404);
      }
    }
    const photo = await this.photosRepository.create(data);

    return photo;
  }
}

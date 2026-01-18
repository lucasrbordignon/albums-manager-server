import { IAlbumsRepository } from '@/shared/interfaces/IAlbumsRepository';
import { CreateAlbumDTO } from '../dtos/CreateAlbumDTO';
import { AppError } from '@/shared/errors/AppError';


export class CreateAlbumUseCase {
  constructor(private albumsRepository: IAlbumsRepository) {}

  async execute(data: CreateAlbumDTO) {
    const exists = await this.albumsRepository.findByTitleAndUserId(
      data.title,
      data.userId
    );
    
    if (exists) {
      throw new AppError('Album with this title already exists for the user', 409);
    }

    const album = await this.albumsRepository.create(data);

    return album;
  }
}

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

    const albumWithSameTitle = await this.albumsRepository.findByTitleAndUserId(
      data.title || albumExists.title,
      albumExists.userId
    );

    if (albumWithSameTitle && albumWithSameTitle.id !== albumId) {
      throw new AppError('Another album with this title already exists for the user', 409);
    }

    try {
      const album = await this.albumsRepository.update(albumId, data);
      return { album };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update album', 500);
    }
  }
}

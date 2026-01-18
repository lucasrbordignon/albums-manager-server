import { IAlbumsRepository } from '@/shared/interfaces/IAlbumsRepository';
import { AppError } from '@/shared/errors/AppError';

export class DeleteAlbumUseCase {
  constructor(private albumsRepository: IAlbumsRepository) {}

  async execute(albumId: string, userId: string) {
    const albumExists = await this.albumsRepository.findById(albumId);
    if (!albumExists) {
      throw new AppError('Album not found', 404);
    }
    if (albumExists.userId !== userId) {
      throw new AppError('You are not allowed to delete this album', 403);
    }
    
    await this.albumsRepository.softDelete(albumId);

    return { message: 'Album deleted successfully' };
  }
}
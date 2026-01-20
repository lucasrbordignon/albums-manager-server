import { IAlbumsRepository } from '@/shared/interfaces/IAlbumsRepository';
import { AppError } from '@/shared/errors/AppError';
import { IPhotosRepository } from '@/shared/interfaces/IPhotosRepository';

export class DeleteAlbumUseCase {
  constructor(private albumsRepository: IAlbumsRepository, private photosRepository: IPhotosRepository) {}

  async execute(albumId: string, userId: string) {
    const albumExists = await this.albumsRepository.findById(albumId);
    if (!albumExists) {
      throw new AppError('Álbum não encontrado', 404);
    }
    if (albumExists.userId !== userId) {
      throw new AppError('Você não tem permissão para deletar este álbum', 403);
    }

    const existPhotos = await this.photosRepository.findManyByAlbum(albumId, { page: 1, limit: 1 });
    if (existPhotos.data.length > 0) {
      throw new AppError('Não é possível deletar um álbum com fotos. Por favor, remova todas as fotos primeiro.', 400);
    }

    await this.albumsRepository.softDelete(albumId);

    return { message: 'Álbum deletado com sucesso' };
  }
}
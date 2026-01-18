import { NextFunction, Request, Response } from 'express';
import { CreatePhotoDTO } from '../dtos/CreatePhotoDTO';
import { PhotosRepository } from '../repositories/photo.repository';
import { CreatePhotoUseCase } from '../use-cases/create-photo-use-case';
import { DeletePhotoUseCase } from '../use-cases/delete-album-use-case';
import { ListPhotosByAlbumUseCase } from '../use-cases/list-photos-by-album-use-case';
import type { ApiResponse } from '@/shared/errors/errorHandler';
import { AlbumsRepository } from '@/modules/albums/repositories/albums.repository';

export class PhotoController {
  private photosRepository: PhotosRepository;
  private albumsRepository: AlbumsRepository;
  private createPhotoUseCase: CreatePhotoUseCase;
  private deletePhotoUseCase: DeletePhotoUseCase;

  constructor() {
    this.photosRepository = new PhotosRepository();
    this.albumsRepository = new AlbumsRepository();
    this.createPhotoUseCase = new CreatePhotoUseCase(this.photosRepository, this.albumsRepository);
    this.deletePhotoUseCase = new DeletePhotoUseCase(this.photosRepository);
  }

  async createPhoto(req: Request, res: Response, next: NextFunction) {
    const data: CreatePhotoDTO = req.body;
    try {
      const photo = await this.createPhotoUseCase.execute(data);
      const response: ApiResponse<typeof photo> = {
        success: true,
        message: 'Photo created successfully',
        data: photo,
        errors: null,
      };
      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async deletePhoto(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.deletePhotoUseCase.execute(id);
      const response: ApiResponse<null> = {
        success: true,
        message: 'Photo deleted successfully',
        data: null,
        errors: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

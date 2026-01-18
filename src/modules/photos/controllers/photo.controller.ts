import { NextFunction, Request, Response } from 'express';
import { CreatePhotoDTO } from '../dtos/CreatePhotoDTO';
import { PrismaPhotosRepository } from '../repositories/photo.repository';
import { CreatePhotoUseCase } from '../use-cases/create-photo-use-case';
import { DeletePhotoUseCase } from '../use-cases/delete-album-use-case';
import { ListPhotosByAlbumUseCase } from '../use-cases/list-photos-by-album-use-case';
import type { ApiResponse } from '@/shared/errors/errorHandler';
import { AlbumsRepository } from '@/modules/albums/repositories/albums.repository';

export class PhotoController {
  private photosRepository: PrismaPhotosRepository;
  private albumsRepository: AlbumsRepository;
  private createPhotoUseCase: CreatePhotoUseCase;
  private deletePhotoUseCase: DeletePhotoUseCase;
  private listPhotosByAlbumUseCase: ListPhotosByAlbumUseCase;

  constructor() {
    this.photosRepository = new PrismaPhotosRepository();
    this.albumsRepository = new AlbumsRepository();
    this.createPhotoUseCase = new CreatePhotoUseCase(this.photosRepository, this.albumsRepository);
    this.deletePhotoUseCase = new DeletePhotoUseCase(this.photosRepository);
    this.listPhotosByAlbumUseCase = new ListPhotosByAlbumUseCase(this.photosRepository, this.albumsRepository);
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

  async listPhotosByAlbum(req: Request, res: Response, next: NextFunction) {
    const { albumId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    try {
      const result = await this.listPhotosByAlbumUseCase.execute({ albumId, page, limit });
      const response: ApiResponse<typeof result> = {
        success: true,
        message: 'Photos retrieved successfully',
        data: result,
        errors: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

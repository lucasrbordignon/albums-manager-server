import { NextFunction, Request, Response } from 'express'
import { createAlbumSchema } from '../schemas/createAlbum.schema'
import { CreateAlbumUseCase } from '../use-cases/create-album-use-case'
import { AlbumsRepository } from '../repositories/albums.repository'
import { FindAlbumByIdUseCase } from '../use-cases/find-album-by-id-use-case'
import { UpdateAlbumUseCase } from '../use-cases/update-album-use-case'
import type { ApiResponse } from '@/shared/errors/errorHandler';
import { FindAlbumsByUserIdUseCase } from '../use-cases/find-albums-by-user-use-case'
import { updateAlbumSchema } from '../schemas/updateAlbum.schema'
import { DeleteAlbumUseCase } from '../use-cases/delete-album-use-case'
import { ListPhotosByAlbumUseCase } from '@/modules/photos/use-cases/list-photos-by-album-use-case'
import { PhotosRepository } from '@/modules/photos/repositories/photo.repository'
import { photoPresenter } from '../utils/photoPresenter'

export class AlbumsController {
  private albumsRepository: AlbumsRepository;
  private photosRepository: PhotosRepository;
  private createAlbumUseCase: CreateAlbumUseCase;
  private findAlbumByIdUseCase: FindAlbumByIdUseCase;
  private updateAlbumUseCase: UpdateAlbumUseCase;
  private findAlbumsByUserIdUseCase: FindAlbumsByUserIdUseCase;
  private deleteAlbumUseCase: DeleteAlbumUseCase;
  private listPhotosByAlbumUseCase: ListPhotosByAlbumUseCase;

  constructor() {
    this.albumsRepository = new AlbumsRepository();
    this.photosRepository = new PhotosRepository();
    this.createAlbumUseCase = new CreateAlbumUseCase(this.albumsRepository);
    this.findAlbumByIdUseCase = new FindAlbumByIdUseCase(this.albumsRepository);
    this.updateAlbumUseCase = new UpdateAlbumUseCase(this.albumsRepository);
    this.findAlbumsByUserIdUseCase = new FindAlbumsByUserIdUseCase(this.albumsRepository);
    this.deleteAlbumUseCase = new DeleteAlbumUseCase(this.albumsRepository);
    this.listPhotosByAlbumUseCase = new ListPhotosByAlbumUseCase(this.photosRepository, this.albumsRepository);
    
  }

  async createAlbum(req: Request, res: Response, next: NextFunction) {
    let data;
    try {
      data = createAlbumSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: null,
        errors: error.errors?.map((e: any) => ({ field: e.path?.[0], message: e.message })) ?? error.message,
      });
    }
    try {
      const album = await this.createAlbumUseCase.execute(data);
      const response: ApiResponse<typeof album> = {
        success: true,
        message: 'Album created successfully',
        data: album,
        errors: null,
      };
      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async findAlbumById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const album = await this.findAlbumByIdUseCase.execute({ albumId: id });
      const response: ApiResponse<typeof album> = {
        success: true,
        message: 'Album retrieved successfully',
        data: album,
        errors: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async updateAlbum(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    let data;
    try {
      data = updateAlbumSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: null,
        errors: error.errors?.map((e: any) => ({ field: e.path?.[0], message: e.message })) ?? error.message,
      });
    }

    try {
      const result = await this.updateAlbumUseCase.execute(data, id);
      const response: ApiResponse<typeof result.album> = {
        success: true,
        message: 'Album updated successfully',
        data: result.album,
        errors: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async findAlbumsByUserId(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const albums = await this.findAlbumsByUserIdUseCase.execute({ userId });
      const response: ApiResponse<typeof albums> = {
        success: true,
        message: 'Albums retrieved successfully',
        data: albums,
        errors: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async deleteAlbum(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const result = await this.deleteAlbumUseCase.execute(id, req.user.id);
      const response: ApiResponse<typeof result> = {
        success: true,
        message: 'Album deleted successfully',
        data: result,
        errors: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async listPhotosByAlbum(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    try {
      const result = await this.listPhotosByAlbumUseCase.execute({ albumId: id, page, limit });
      const presented = {
        ...result,
        data: result.data.map(photoPresenter)
      };
      const response: ApiResponse<typeof presented> = {
        success: true,
        message: 'Photos retrieved successfully',
        data: presented,
        errors: null,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}
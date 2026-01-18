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

export class AlbumsController {
  private albumsRepository: AlbumsRepository;
  private createAlbumUseCase: CreateAlbumUseCase;
  private findAlbumByIdUseCase: FindAlbumByIdUseCase;
  private updateAlbumUseCase: UpdateAlbumUseCase;
  private findAlbumsByUserIdUseCase: FindAlbumsByUserIdUseCase;
  private deleteAlbumUseCase: DeleteAlbumUseCase;

  constructor() {
    this.albumsRepository = new AlbumsRepository();
    this.createAlbumUseCase = new CreateAlbumUseCase(this.albumsRepository);
    this.findAlbumByIdUseCase = new FindAlbumByIdUseCase(this.albumsRepository);
    this.updateAlbumUseCase = new UpdateAlbumUseCase(this.albumsRepository);
    this.findAlbumsByUserIdUseCase = new FindAlbumsByUserIdUseCase(this.albumsRepository);
    this.deleteAlbumUseCase = new DeleteAlbumUseCase(this.albumsRepository);
  }

  async createAlbum(req: Request, res: Response, next: NextFunction) {
    const data = createAlbumSchema.parse(req.body);
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
    const data = updateAlbumSchema.parse(req.body);

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
}
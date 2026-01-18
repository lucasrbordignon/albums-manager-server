import { NextFunction, Request, Response } from 'express'
import { createAlbumSchema } from '../schemas/createAlbum.schema'
import { CreateAlbumUseCase } from '../use-cases/create-album-use-case'
import { AlbumsRepository } from '../repositories/albums.repository'
import { FindAlbumByIdUseCase } from '../use-cases/find-album-by-id-use-case'
import { UpdateAlbumUseCase } from '../use-cases/update-album-use-case'
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
      return res.status(201).json({
        status: 'success',
        message: 'Album created successfully',
        data: album,
        errors: null
      });
    } catch (error) {
      return next(error);
    }
  }

  async findAlbumById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const album = await this.findAlbumByIdUseCase.execute({ albumId: id });
      return res.status(200).json({
        status: 'success',
        message: 'Album retrieved successfully',
        data: album,
        errors: null
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateAlbum(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = updateAlbumSchema.parse(req.body);

    try {
      const result = await this.updateAlbumUseCase.execute(data, id);
      return res.status(200).json({
        status: 'success',
        message: 'Album updated successfully',
        data: result.album,
        errors: null
      });
    } catch (error) {
      return next(error);
    }
  }

  async findAlbumsByUserId(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const albums = await this.findAlbumsByUserIdUseCase.execute({ userId });
      return res.status(200).json({
        status: 'success',
        message: 'Albums retrieved successfully',
        data: albums,
        errors: null
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAlbum(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const userId = 'c556f75c-048c-444f-86ab-61eba486a471'; // This should come from authenticated user context

    try {
      const result = await this.deleteAlbumUseCase.execute(id, userId);
      return res.status(200).json({
        status: 'success',
        message: 'Album deleted successfully',
        data: result,
        errors: null
      });
    } catch (error) {
      return next(error);
    }
  }
}
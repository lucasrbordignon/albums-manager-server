import { NextFunction, Request, Response } from 'express'
import { PhotosRepository } from '../repositories/photo.repository'
import { DeletePhotoUseCase } from '../use-cases/delete-album-use-case'
import type { ApiResponse } from '@/shared/errors/errorHandler'
import fs from 'fs/promises'
import { AppError } from '@/shared/errors/AppError'
import { ProcessPhotoUseCase } from '../use-cases/process-photo-use-case'
import { CreatePhotoUseCase } from '../use-cases/create-photo-use-case'
import { AlbumsRepository } from '@/modules/albums/repositories/albums.repository'
import { photoPresenter } from '@/modules/albums/utils/photoPresenter'

export class PhotoController {
  private photosRepository: PhotosRepository
  private deletePhotoUseCase: DeletePhotoUseCase

  constructor() {
    this.photosRepository = new PhotosRepository()
    this.deletePhotoUseCase = new DeletePhotoUseCase(this.photosRepository)
  }

  async deletePhoto(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      await this.deletePhotoUseCase.execute(id)
      const response: ApiResponse<null> = {
        success: true,
        message: 'Foto deletada com sucesso',
        data: null,
        errors: null
      }
      return res.status(200).json(response)
    } catch (error) {
      return next(error)
    }
  }

  async uploadPhoto(req: Request, res: Response, next: NextFunction) {
    console.log('UPLOADPHOTO', req.file, req.body);
    try {
      if (!req.file) {
        throw new AppError('Arquivo obrigatório', 400)
      }

      if (!req.file.mimetype.startsWith('image/')) {
        throw new AppError('Tipo de arquivo inválido', 400)
      }

      const albumsRepo = new AlbumsRepository();
      const photosRepo = new PhotosRepository();
      const createPhotoUseCase = new CreatePhotoUseCase(photosRepo, albumsRepo);
      const processPhotoUseCase = new ProcessPhotoUseCase(createPhotoUseCase);

      const photo = await processPhotoUseCase.execute({
        tempPath: req.file.path,
        originalName: req.file.originalname,
        userId: req.user.id,
        albumId: req.body.albumId,
        acquiredAt: req.body.acquiredAt
      });

      return res.status(201).json({
        success: true,
        message: 'Foto enviada e processada com sucesso',
        data: photoPresenter(photo),
        errors: null
      });
    } catch (error) {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {})
      }
      return next(error)
    }
  }
}

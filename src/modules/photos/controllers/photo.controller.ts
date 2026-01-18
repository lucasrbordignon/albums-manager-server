import { NextFunction, Request, Response } from 'express'
import { PhotosRepository } from '../repositories/photo.repository'
import { DeletePhotoUseCase } from '../use-cases/delete-album-use-case'
import type { ApiResponse } from '@/shared/errors/errorHandler'
import fs from 'fs/promises'
import { AppError } from '@/shared/errors/AppError'
import { imageQueue } from '@/queues/image.queue'

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
        message: 'Photo deleted successfully',
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
        throw new AppError('Invalid file type', 400)
      }

      console.log('[QUEUE] enqueue image-processing', {
        userId: req.user.id,
        file: req.file?.path,
      });

      const job = await imageQueue.add('process-photo', {
        tempPath: req.file.path,
        originalName: req.file.originalname,
        userId: req.user.id,
        albumId: req.body.albumId,
        acquiredAt: req.body.acquiredAt
      })

      console.log('[QUEUE] job criado', {
        id: job.id,
        name: job.name,
      });

      return res.status(202).json({
        success: true,
        message: 'Photo queued for processing',
        data: null,
        errors: null
      })
    } catch (error) {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {})
      }
      return next(error)
    }
  }
}

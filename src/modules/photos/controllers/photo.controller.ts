import { NextFunction, Request, Response } from 'express'
import { CreatePhotoDTO } from '../dtos/CreatePhotoDTO'
import { PhotosRepository } from '../repositories/photo.repository'
import { CreatePhotoUseCase } from '../use-cases/create-photo-use-case'
import { DeletePhotoUseCase } from '../use-cases/delete-album-use-case'
import type { ApiResponse } from '@/shared/errors/errorHandler'
import { AlbumsRepository } from '@/modules/albums/repositories/albums.repository'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { AppError } from '@/shared/errors/AppError'
import { imageQueue } from '@/queues/image.queue'

const uploadRoot =
  process.env.UPLOAD_DIR ?? path.resolve(process.cwd(), 'uploads')

export class PhotoController {
  private photosRepository: PhotosRepository
  private albumsRepository: AlbumsRepository
  private createPhotoUseCase: CreatePhotoUseCase
  private deletePhotoUseCase: DeletePhotoUseCase

  constructor() {
    this.photosRepository = new PhotosRepository()
    this.albumsRepository = new AlbumsRepository()
    this.createPhotoUseCase = new CreatePhotoUseCase(
      this.photosRepository,
      this.albumsRepository
    )
    this.deletePhotoUseCase = new DeletePhotoUseCase(this.photosRepository)
  }

  async createPhoto(req: Request, res: Response, next: NextFunction) {
    const data: CreatePhotoDTO = req.body
    try {
      const photo = await this.createPhotoUseCase.execute(data)
      const response: ApiResponse<typeof photo> = {
        success: true,
        message: 'Photo created successfully',
        data: photo,
        errors: null
      }
      return res.status(201).json(response)
    } catch (error) {
      return next(error)
    }
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
    try {
      if (!req.file) {
        throw new AppError('Arquivo obrigatório', 400)
      }

      if (!req.file.mimetype.startsWith('image/')) {
        throw new AppError('Invalid file type', 400)
      }

      await imageQueue.add('process-photo', {
        tempPath: req.file.path,
        originalName: req.file.originalname,
        userId: req.user.id,
        albumId: req.body.albumId,
        acquiredAt: req.body.acquiredAt
      })

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

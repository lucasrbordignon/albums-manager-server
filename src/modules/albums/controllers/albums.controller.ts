import { NextFunction, Request, Response } from 'express'
import z from 'zod'
import { createAlbumSchema } from '../schemas/createAlbum.schema'
import { CreateAlbumUseCase } from '../use-cases/create-album-use-case'
import { AlbumsRepository } from '../repositories/albums.repository'
import { FindAlbumByIdUseCase } from '../use-cases/find-album-by-id-use-case'
import { UpdateAlbumUseCase } from '../use-cases/update-album-use-case'
import { FindAlbumsByUserIdUseCase } from '../use-cases/find-albums-by-user-use-case'
import { updateAlbumSchema } from '../schemas/updateAlbum.schema'
import { DeleteAlbumUseCase } from '../use-cases/delete-album-use-case'

export class AlbumsController {
  async createAlbum(req: Request, res: Response, next: NextFunction) {
    const createAlbumUseCase = new CreateAlbumUseCase(new AlbumsRepository())
    const data = createAlbumSchema.parse(req.body)

    if (!data) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid request data',
        data: null,
        errors: null
      })
    }

    try {
      const album = await createAlbumUseCase.execute(data)

      return res.status(201).json({
        status: 'success',
        message: 'Album created successfully',
        data: album,
        errors: null
      })
    } catch (error) {
      return next(error)
    }
  }

  async findAlbumById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const findAlbumByIdUseCase = new FindAlbumByIdUseCase(new AlbumsRepository())

    try {
      const album = await findAlbumByIdUseCase.execute({ albumId: id })
      
      return res.status(200).json({
        status: 'success',
        message: 'Album retrieved successfully',
        data: album,
        errors: null
      })
    } catch (error) {
      return next(error)
    }
  }

  async updateAlbum(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const data =  updateAlbumSchema.parse(req.body)

    if (!data) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid request data',
        data: null,
        errors: null
      })
    }

    const updateAlbumUseCase = new UpdateAlbumUseCase(new AlbumsRepository())

    try {
      const result = await updateAlbumUseCase.execute(data, id)

      return res.status(200).json({
        status: 'success',
        message: 'Album updated successfully',
        data: result.album,
        errors: null
      })
    } catch (error) {
      return next(error)
    }
  }

  async findAlbumsByUserId(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    const findAlbumsByUserIdUseCase = new FindAlbumsByUserIdUseCase(new AlbumsRepository())

    try {
      const albums = await findAlbumsByUserIdUseCase.execute({ userId })
      
      return res.status(200).json({
        status: 'success',
        message: 'Albums retrieved successfully',
        data: albums,
        errors: null
      })
    } catch (error) {
      return next(error)
    }
  }

  async deleteAlbum(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const deleteAlbumUseCase = new DeleteAlbumUseCase(new AlbumsRepository())

    try {
      const result = await deleteAlbumUseCase.execute(id)

      return res.status(200).json({
        status: 'success',
        message: 'Album deleted successfully',
        data: result,
        errors: null
      })
    } catch (error) {
      return next(error)
    }
  }
}
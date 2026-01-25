import sharp from 'sharp'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { CreatePhotoUseCase } from './create-photo-use-case'
import type { CreatePhotoDTO } from '../dtos/CreatePhotoDTO'

const uploadRoot =
  process.env.UPLOAD_DIR ?? path.resolve(process.cwd(), 'uploads')

type Input = {
  tempPath: string
  originalName: string
  userId: string
  albumId?: string
  acquiredAt?: string
}

export class ProcessPhotoUseCase {
  constructor(private createPhotoUseCase: CreatePhotoUseCase) {}

  async execute(input: Input) {
    let buffer: Buffer

    try {
      buffer = await fs.readFile(input.tempPath)

      const image = sharp(buffer, { failOn: 'none' })

      const hash = crypto.createHash('sha256').update(buffer).digest('hex')

      const userDir = path.join(uploadRoot, 'users', input.userId, 'photos')
      const thumbDir = path.join(userDir, 'thumbs')

      await fs.mkdir(thumbDir, { recursive: true })

      const fileName = `${hash}.webp`
      const imagePath = path.join(userDir, fileName)
      const thumbPath = path.join(thumbDir, fileName)

      await image
        .clone()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(imagePath)

      await image
        .clone()
        .resize({ width: 300 })
        .webp({ quality: 70 })
        .toFile(thumbPath)

      const { dominant } = await sharp(imagePath).stats()

      const dominantColor = dominant
        ? `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g
            .toString(16)
            .padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`
        : undefined

      const stats = await fs.stat(imagePath)

      const data: CreatePhotoDTO = {
        title: path.parse(input.originalName).name,
        albumId: input.albumId,
        acquiredAt: input.acquiredAt ? new Date(input.acquiredAt) : new Date(),
        sizeInBytes: stats.size,
        mimeType: 'image/webp',
        filePath: imagePath,
        thumbnailPath: thumbPath,
        dominantColor
      }

      return await this.createPhotoUseCase.execute(data)
    } catch (error) {
      console.error('PROCESS PHOTO ERROR:', error)

      throw new (await import('@/shared/errors/AppError')).AppError(
        'Erro ao processar a imagem',
        500
      )
    } finally {
      await fs.unlink(input.tempPath).catch(() => {})
    }
  }
}

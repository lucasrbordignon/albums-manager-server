import sharp from 'sharp';
import { Vibrant } from 'node-vibrant/node';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { CreatePhotoUseCase } from './create-photo-use-case';
import type { CreatePhotoDTO } from '../dtos/CreatePhotoDTO';
import { PhotosRepository } from '../repositories/photo.repository';

const uploadRoot =
  process.env.UPLOAD_DIR ??
  path.resolve(process.cwd(), 'uploads');

type Input = {
  tempPath: string;
  originalName: string;
  userId: string;
  albumId?: string;
  acquiredAt?: string;
};

export class ProcessPhotoUseCase {
  constructor(
    private createPhotoUseCase: CreatePhotoUseCase,
  ) {}

  async execute(input: Input) {
    const buffer = await fs.readFile(input.tempPath);

    const hash = crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex');

    const userDir = path.join(
      uploadRoot,
      'users',
      input.userId,
      'photos'
    );

    const thumbDir = path.join(userDir, 'thumbs');

    await fs.mkdir(userDir, { recursive: true });
    await fs.mkdir(thumbDir, { recursive: true });

    const fileName = `${hash}.webp`;
    const imagePath = path.join(userDir, fileName);
    const thumbPath = path.join(thumbDir, fileName);

    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(imagePath);

    await sharp(buffer)
      .resize({ width: 300 })
      .webp({ quality: 70 })
      .toFile(thumbPath);

    const palette = await Vibrant.from(buffer).getPalette();
    const dominantColor = palette.Vibrant?.hex ?? null;

    const stats = await fs.stat(imagePath);

    const data: CreatePhotoDTO = {
      title: input.originalName,
      albumId: input.albumId ?? '',
      acquiredAt: input.acquiredAt
        ? new Date(input.acquiredAt)
        : new Date(),
      sizeInBytes: stats.size,
      mimeType: 'image/webp',
      filePath: imagePath,
      thumbnailPath: thumbPath,
      dominantColor: dominantColor ?? undefined,
    };

    const photo = await this.createPhotoUseCase.execute(data);

    await fs.unlink(input.tempPath).catch(() => {});

    return photo;
  }
}

import { AppError } from "@/shared/errors/AppError"
import { IPhotosRepository } from "@/shared/interfaces/IPhotosRepository"
import fs from 'fs/promises';
import path from 'path';

export class DeletePhotoUseCase {
  constructor(private photosRepository: IPhotosRepository) {}

  async execute(photoId: string) {
    const photo = await this.photosRepository.findById(photoId)

    if (!photo) {
      throw new AppError('Photo not found', 404)
    }

    await this.photosRepository.softDelete(photoId)

    if (photo.filePath) {
      const deletedDir = path.join(path.dirname(photo.filePath), 'deleted');
      await fs.mkdir(deletedDir, { recursive: true });
      const destPath = path.join(deletedDir, path.basename(photo.filePath));
      await fs.rename(photo.filePath, destPath).catch(() => {});
    }
    if (photo.thumbnailPath) {
      const thumbDeletedDir = path.join(path.dirname(photo.thumbnailPath), 'deleted');
      await fs.mkdir(thumbDeletedDir, { recursive: true });
      const thumbDestPath = path.join(thumbDeletedDir, path.basename(photo.thumbnailPath));
      await fs.rename(photo.thumbnailPath, thumbDestPath).catch(() => {});
    }
  }
}

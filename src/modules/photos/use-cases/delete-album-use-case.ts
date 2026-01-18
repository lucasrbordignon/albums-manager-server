import { AppError } from "@/shared/errors/AppError"
import { IPhotosRepository } from "@/shared/interfaces/IPhotosRepository"

export class DeletePhotoUseCase {
  constructor(private photosRepository: IPhotosRepository) {}

  async execute(photoId: string) {
    const photo = await this.photosRepository.findById(photoId)

    if (!photo) {
      throw new AppError('Photo not found', 404)
    }

    await this.photosRepository.softDelete(photoId)
  }
}

import { CreatePhotoDTO } from "@/modules/photos/dtos/CreatePhotoDTO"
import { PaginationParams } from "./IPaginationParams"
import { PaginatedResponse } from "./IPaginatedResponse"
import { Photo } from "@/generated/prisma/client"

export interface IPhotosRepository {
  create(data: CreatePhotoDTO): Promise<Photo>
  softDelete(photoId: string): Promise<void>
  findById(photoId: string): Promise<Photo | null>
  findManyByAlbum(albumId: string, params: PaginationParams): Promise<PaginatedResponse<Photo>>
}
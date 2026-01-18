export interface CreatePhotoDTO {
  title: string
  description?: string
  acquiredAt: Date
  sizeInBytes: number
  mimeType: string
  filePath: string
  dominantColor?: string
  albumId?: string
}

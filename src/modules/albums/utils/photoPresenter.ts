import type { Photo } from '@/generated/prisma/client';

export function photoPresenter(photo: Photo) {
  const baseUrl = process.env.API_URL;
  return {
    id: photo.id,
    title: photo.title,
    imageUrl: baseUrl + photo.filePath.replace('/app', ''),
    thumbnailUrl: photo.thumbnailPath ? baseUrl + photo.thumbnailPath.replace('/app', '') : null,
    dominantColor: photo.dominantColor,
    acquiredAt: photo.acquiredAt,
    sizeInBytes: photo.sizeInBytes,
    mimeType: photo.mimeType,
  };
}

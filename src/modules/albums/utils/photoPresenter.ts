import type { Photo } from '@/generated/prisma/client';
import { serialize } from 'v8';

export function photoPresenter(photo: Photo) {
  const baseUrl = process.env.API_URL ?? 'http://localhost:3333';
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

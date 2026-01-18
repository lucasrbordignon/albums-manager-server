import '@/config/env'; // garante env carregado
import { ConnectionOptions, Worker } from 'bullmq';
import { redis } from '@/config/redis';
import { ProcessPhotoUseCase } from '@/modules/photos/use-cases/process-photo-use-case';
import { CreatePhotoUseCase } from '@/modules/photos/use-cases/create-photo-use-case';
import { AlbumsRepository } from '@/modules/albums/repositories/albums.repository';
import { PhotosRepository } from '@/modules/photos/repositories/photo.repository';

const photosRepository = new PhotosRepository();
const albumsRepository = new AlbumsRepository();
const createPhotoUseCase = new CreatePhotoUseCase(photosRepository, albumsRepository);
const processPhotoUseCase = new ProcessPhotoUseCase(createPhotoUseCase, photosRepository);

new Worker(
  'image-processing',
  async job => {
    const result = await processPhotoUseCase.execute(job.data);

    await redis.publish(
      'photo:processed',
      JSON.stringify({
        userId: job.data.userId,
        photo: result,
      })
    );

    return result;
  },
  {
    connection: redis as unknown as ConnectionOptions,
    concurrency: 2,
  }
);
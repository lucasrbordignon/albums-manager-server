import { ConnectionOptions, Worker } from 'bullmq';
import { redis } from '@/config/redis';
import { PhotosRepository } from '@/modules/photos/repositories/photo.repository';
import { AlbumsRepository } from '@/modules/albums/repositories/albums.repository';
import { CreatePhotoUseCase } from '@/modules/photos/use-cases/create-photo-use-case';
import { ProcessPhotoUseCase } from '@/modules/photos/use-cases/process-photo-use-case';

console.log('[WORKER] image-processing iniciado');

const photosRepo = new PhotosRepository();
const albumsRepo = new AlbumsRepository();

const createPhotoUseCase = new CreatePhotoUseCase(
  photosRepo,
  albumsRepo
);

const processPhotoUseCase = new ProcessPhotoUseCase(
  createPhotoUseCase
);

const worker = new Worker(
  'image-processing',
  async job => {
    console.log('[WORKER] job recebido', job.id);

    const result = await processPhotoUseCase.execute(job.data);

    return result;
  },
  {
    connection: redis as unknown as ConnectionOptions,
  }
);

worker.on('completed', job => {
  console.log('[WORKER] completed', job.id);
});

worker.on('failed', (job, err) => {
  console.error('[WORKER] failed', job?.id, err);
});

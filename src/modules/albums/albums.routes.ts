import { Router } from 'express';
import { AlbumsController } from './controllers/albums.controller';
import { ensureAuthenticated } from '../auth/middlewares/auth.middleware';

const albumsRoutes = Router();
const controller = new AlbumsController();

albumsRoutes.use(ensureAuthenticated);
albumsRoutes.post('/', controller.createAlbum.bind(controller));
albumsRoutes.get('/:id', controller.findAlbumById.bind(controller));
albumsRoutes.put('/:id', controller.updateAlbum.bind(controller));
albumsRoutes.delete('/:id', controller.deleteAlbum.bind(controller));
albumsRoutes.get('/:id/photos', controller.listPhotosByAlbum.bind(controller));

export { albumsRoutes };

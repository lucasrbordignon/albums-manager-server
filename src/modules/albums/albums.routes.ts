import { Router } from 'express'
import { AlbumsController } from './controllers/albums.controller';

const albumsRoutes = Router();
const controller = new AlbumsController();

albumsRoutes.post('/', controller.createAlbum);
albumsRoutes.get('/:id', controller.findAlbumById);
albumsRoutes.put('/:id', controller.updateAlbum);
albumsRoutes.delete('/:id', controller.deleteAlbum);

export { albumsRoutes };

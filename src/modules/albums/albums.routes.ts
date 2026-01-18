import { Router } from 'express'
import { AlbumsController } from './controllers/albums.controller';

const albumsRoutes = Router();
const controller = new AlbumsController();

albumsRoutes.post('/', controller.createAlbum.bind(controller));
albumsRoutes.get('/:id', controller.findAlbumById.bind(controller));
albumsRoutes.put('/:id', controller.updateAlbum.bind(controller));
albumsRoutes.delete('/:id', controller.deleteAlbum.bind(controller));

export { albumsRoutes };

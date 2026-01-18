
import { Router } from 'express';
import { ensureAuthenticated } from '../auth/middlewares/auth.middleware';
import { PhotoController } from './controllers/photo.controller';

const photosRoutes = Router();
const controller = new PhotoController();
photosRoutes.use(ensureAuthenticated);
photosRoutes.post('/', controller.createPhoto.bind(controller));
photosRoutes.delete('/:id', controller.deletePhoto.bind(controller));

export { photosRoutes };

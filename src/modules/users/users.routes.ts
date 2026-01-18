import { Router } from "express";
import { AlbumsController } from "../albums/controllers/albums.controller";
import { ensureAuthenticated } from "../auth/middlewares/auth.middleware";

const usersRoutes = Router();
const albumsController = new AlbumsController();

usersRoutes.use(ensureAuthenticated);
usersRoutes.get('/:userId/albums', albumsController.findAlbumsByUserId.bind(albumsController));

export { usersRoutes };

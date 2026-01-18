import { Router } from "express";
import { AlbumsController } from "../albums/controllers/albums.controller";

const usersRoutes = Router();
const albumsController = new AlbumsController();

usersRoutes.get('/:userId/albums', albumsController.findAlbumsByUserId.bind(albumsController));

export { usersRoutes };

import { Router } from "express";
import { AlbumsRepository } from "../albums/repositories/albums.repository";
import { FindAlbumsByUserIdUseCase } from "../albums/use-cases/find-albums-by-user-use-case";
import { AlbumsController } from "../albums/controllers/albums.controller";

const usersRoutes = Router();
const albumsController = new AlbumsController();

usersRoutes.get('/:userId/albums', albumsController.findAlbumsByUserId.bind(albumsController));

export { usersRoutes };

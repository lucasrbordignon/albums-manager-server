import cors from 'cors';
import express from 'express';
import healthRoutes from './modules/health/health.route';
import { authRoutes } from './modules/auth/auth.routes';
import { errorHandler } from './shared/errors/errorHandler';
import { albumsRoutes } from './modules/albums/albums.routes';
import { usersRoutes } from './modules/users/users.routes';
import { photosRoutes } from './modules/photos/photo.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/albums', albumsRoutes);
app.use('/users', usersRoutes);
app.use('/photos', photosRoutes);

app.use(errorHandler)

export { app };
import cors from 'cors';
import express from 'express';
import healthRoutes from './modules/health/health.route';
import { authRoutes } from './modules/auth/auth.routes';
import { errorHandler } from './shared/errors/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/health', healthRoutes);

app.use(errorHandler)

export { app };
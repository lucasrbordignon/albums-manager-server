import cors from 'cors';
import express from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { errorHandler } from './shared/errors/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.use(errorHandler)

export { app };




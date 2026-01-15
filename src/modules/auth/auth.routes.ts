import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { ensureAuthenticated } from './middlewares/auth.middleware';

const authRoutes = Router();
const controller = new AuthController();

authRoutes.post('/register', controller.register);
authRoutes.post('/login', controller.login);
authRoutes.post('/refresh-token', controller.refreshToken);
authRoutes.post('/forgot-password', controller.forgotPassword);
authRoutes.post('/reset-password', controller.resetPassword);

authRoutes.get('/me', ensureAuthenticated, async (req, res) => {
  return res.json({
    message: 'You are authenticated',
    userId: req.user.id,
  });
});

export { authRoutes };

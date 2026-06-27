import { Router } from 'express';
import * as userController from '../controllers/users';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);

// Protected routes
router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, userController.updateMe);
router.get('/me/saved-tools', authMiddleware, userController.getSavedTools);
router.get('/me/saved-workflows', authMiddleware, userController.getSavedWorkflows);

export default router;

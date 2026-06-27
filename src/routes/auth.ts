import { Router } from 'express';
import * as authController from '../controllers/auth';

const router = Router();

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Protected
router.get('/me', authController.me);
router.post('/logout', authController.logout);

export default router;

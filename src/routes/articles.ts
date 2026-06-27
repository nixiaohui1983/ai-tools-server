import { Router } from 'express';
import * as articleController from '../controllers/articles';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', articleController.listArticles);
router.get('/:id', articleController.getArticle);
router.get('/category/:category', articleController.getArticlesByCategory);

// Admin routes
router.post('/', authMiddleware, articleController.createArticle);
router.put('/:id', authMiddleware, articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);
router.post('/:id/publish', authMiddleware, articleController.publishArticle);

export default router;

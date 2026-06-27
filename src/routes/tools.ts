import { Router } from 'express';
import * as toolController from '../controllers/tools';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', toolController.listTools);
router.get('/:id', toolController.getTool);
router.get('/:id/relations', toolController.getToolRelations);
router.get('/:id/alternatives', toolController.getToolAlternatives);

// Protected routes
router.post('/:id/save', authMiddleware, toolController.saveTool);
router.delete('/:id/save', authMiddleware, toolController.unsaveTool);

// Admin routes (would need admin middleware)
router.post('/', authMiddleware, toolController.createTool);
router.put('/:id', authMiddleware, toolController.updateTool);
router.delete('/:id', authMiddleware, toolController.deleteTool);

export default router;

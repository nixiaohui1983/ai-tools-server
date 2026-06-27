import { Router } from 'express';
import * as taskController from '../controllers/tasks';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.get('/:id/workflows', taskController.getTaskWorkflows);

// Admin routes
router.post('/', authMiddleware, taskController.createTask);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

export default router;

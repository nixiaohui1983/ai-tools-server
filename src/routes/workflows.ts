import { Router } from 'express';
import * as workflowController from '../controllers/workflows';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', workflowController.listWorkflows);
router.get('/:id', workflowController.getWorkflow);
router.get('/:id/tools', workflowController.getWorkflowTools);

// Protected routes
router.post('/', authMiddleware, workflowController.createWorkflow);
router.put('/:id', authMiddleware, workflowController.updateWorkflow);
router.delete('/:id', authMiddleware, workflowController.deleteWorkflow);
router.post('/:id/save', authMiddleware, workflowController.saveWorkflow);
router.delete('/:id/save', authMiddleware, workflowController.unsaveWorkflow);

export default router;

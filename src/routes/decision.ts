import { Router } from 'express';
import * as decisionController from '../controllers/decision';

const router = Router();

// Decision engine routes
router.post('/recommend-tools', decisionController.recommendTools);
router.post('/compare', decisionController.compareTools);
router.post('/generate-workflow', decisionController.generateWorkflow);

export default router;

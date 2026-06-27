import { Request, Response } from 'express';
import * as decisionService from '../services/decision';

export const recommendTools = async (req: Request, res: Response) => {
  try {
    const { task, budget, categories, capabilities } = req.body;
    const recommendations = await decisionService.recommendTools({
      task,
      budget,
      categories,
      capabilities,
    });
    res.json({ data: recommendations });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const compareTools = async (req: Request, res: Response) => {
  try {
    const { toolIds } = req.body;
    if (!toolIds || !Array.isArray(toolIds) || toolIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 tool IDs required' });
    }
    const comparison = await decisionService.compareTools(toolIds);
    res.json({ data: comparison });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const generateWorkflow = async (req: Request, res: Response) => {
  try {
    const { taskId, preferences } = req.body;
    const workflow = await decisionService.generateWorkflow(taskId, preferences);
    res.json({ data: workflow });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

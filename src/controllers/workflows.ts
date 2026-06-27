import { Request, Response } from 'express';
import * as workflowService from '../services/workflows';
import { getQueryString, getQueryNumber } from '../utils/query';

export const listWorkflows = async (req: Request, res: Response) => {
  try {
    const limit = getQueryNumber(req.query['limit'], 20);
    const offset = getQueryNumber(req.query['offset'], 0);
    const taskId = getQueryString(req.query['taskId']);
    const result = await workflowService.listWorkflows({ limit, offset, taskId });
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getWorkflow = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const workflow = await workflowService.getWorkflowById(id);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.json({ data: workflow });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getWorkflowTools = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const tools = await workflowService.getWorkflowTools(id);
    res.json({ data: tools });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createWorkflow = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const workflow = await workflowService.createWorkflow({ ...req.body, createdBy: userId });
    res.status(201).json({ data: workflow });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateWorkflow = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const workflow = await workflowService.updateWorkflow(id, req.body);
    res.json({ data: workflow });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteWorkflow = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await workflowService.deleteWorkflow(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const saveWorkflow = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const id = req.params['id'] as string;
    await workflowService.saveWorkflow(userId, id);
    res.status(200).json({ message: 'Workflow saved' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const unsaveWorkflow = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const id = req.params['id'] as string;
    await workflowService.unsaveWorkflow(userId, id);
    res.status(200).json({ message: 'Workflow removed from saved' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

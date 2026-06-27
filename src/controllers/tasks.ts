import { Request, Response } from 'express';
import * as taskService from '../services/tasks';
import { getQueryString, getQueryNumber } from '../utils/query';

export const listTasks = async (req: Request, res: Response) => {
  try {
    const category = getQueryString(req.query['category']);
    const limit = getQueryNumber(req.query['limit'], 20);
    const offset = getQueryNumber(req.query['offset'], 0);
    const result = await taskService.listTasks({ category, limit, offset });
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const task = await taskService.getTaskById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTaskWorkflows = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const workflows = await taskService.getTaskWorkflows(id);
    res.json({ data: workflows });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({ data: task });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const task = await taskService.updateTask(id, req.body);
    res.json({ data: task });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

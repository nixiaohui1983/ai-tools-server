import { Request, Response } from 'express';
import * as toolService from '../services/tools';
import { getQueryString, getQueryNumber } from '../utils/query';

export const listTools = async (req: Request, res: Response) => {
  try {
    const category = getQueryString(req.query['category']);
    const search = getQueryString(req.query['search']);
    const limit = getQueryNumber(req.query['limit'], 20);
    const offset = getQueryNumber(req.query['offset'], 0);
    const tools = await toolService.listTools({ category, search, limit, offset });
    res.json({ data: tools });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTool = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const tool = await toolService.getToolById(id);
    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    res.json({ data: tool });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getToolRelations = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const relations = await toolService.getToolRelations(id);
    res.json({ data: relations });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getToolAlternatives = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const alternatives = await toolService.getToolAlternatives(id);
    res.json({ data: alternatives });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createTool = async (req: Request, res: Response) => {
  try {
    const tool = await toolService.createTool(req.body);
    res.status(201).json({ data: tool });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateTool = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const tool = await toolService.updateTool(id, req.body);
    res.json({ data: tool });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteTool = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await toolService.deleteTool(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const saveTool = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const id = req.params['id'] as string;
    await toolService.saveTool(userId, id);
    res.status(200).json({ message: 'Tool saved' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const unsaveTool = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const id = req.params['id'] as string;
    await toolService.unsaveTool(userId, id);
    res.status(200).json({ message: 'Tool removed from saved' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

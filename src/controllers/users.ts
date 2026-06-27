import { Request, Response } from 'express';
import * as userService from '../services/users';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await userService.register(email, password, name);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET
    );
    res.status(201).json({ data: { user, token } });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET
    );
    res.json({ data: { user, token } });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const refreshToken = async (_req: Request, res: Response) => {
  res.json({ message: 'Token refresh not implemented yet' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await userService.updateUser(userId, req.body);
    res.json({ data: user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSavedTools = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const tools = await userService.getSavedTools(userId);
    res.json({ data: tools });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getSavedWorkflows = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const workflows = await userService.getSavedWorkflows(userId);
    res.json({ data: workflows });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

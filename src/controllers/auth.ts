import { Request, Response } from 'express';
import * as authService from '../services/auth';
import { getQueryString } from '../utils/query';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes('already exists')) {
      return res.status(409).json({ error: msg });
    }
    res.status(500).json({ error: msg });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const result = await authService.login(email, password);
    // Set httpOnly cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ user: result.user });
  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes('Invalid') || msg.includes('not found')) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(500).json({ error: msg });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No token' });
    const result = await authService.refreshToken(token);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ user: result.user });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await authService.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

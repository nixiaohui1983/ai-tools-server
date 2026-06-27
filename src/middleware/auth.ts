import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

function extractToken(req: Request): string | null {
  // Try Authorization header first
  const headerToken = req.headers['authorization']?.replace('Bearer ', '');
  if (headerToken) return headerToken;

  // Fall back to httpOnly cookie
  return req.cookies?.token || null;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

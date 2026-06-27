import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';
const prisma = new PrismaClient();

function signToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function register(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');

  // In production, hash password with bcrypt
  const passwordHash = Buffer.from(password).toString('base64'); // Placeholder - use bcrypt in prod

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  // In production, use bcrypt.compare
  const inputHash = Buffer.from(password).toString('base64');
  if (inputHash !== user.passwordHash) throw new Error('Invalid password');

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function refreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  // Issue new token
  const newToken = signToken({ id: decoded.id, email: decoded.email, role: decoded.role });
  return {
    token: newToken,
    user: { id: decoded.id, email: decoded.email, role: decoded.role },
  };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
}

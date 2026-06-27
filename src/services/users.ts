import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export async function register(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
  });
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password');

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
  });
}

export async function updateUser(id: string, data: any) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
  });
}

export async function getSavedTools(userId: string) {
  return prisma.savedTool.findMany({
    where: { userId },
    include: { tool: true },
  });
}

export async function getSavedWorkflows(userId: string) {
  return prisma.savedWorkflow.findMany({
    where: { userId },
    include: { workflow: true },
  });
}

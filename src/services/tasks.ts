import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ListTasksParams {
  category?: string;
  limit: number;
  offset: number;
}

export async function listTasks(params: ListTasksParams) {
  const where: any = {};
  if (params.category) {
    where.category = params.category;
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      take: params.limit,
      skip: params.offset,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
    }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total };
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: { workflows: { include: { tools: { include: { tool: true } } } } },
  });
}

export async function getTaskWorkflows(taskId: string) {
  return prisma.workflow.findMany({
    where: { taskId },
    include: { tools: { include: { tool: true } } },
  });
}

export async function createTask(data: any) {
  return prisma.task.create({ data });
}

export async function updateTask(id: string, data: any) {
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}

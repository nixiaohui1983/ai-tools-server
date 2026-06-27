import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ListWorkflowsParams {
  limit: number;
  offset: number;
  taskId?: string;
}

export async function listWorkflows(params: ListWorkflowsParams) {
  const where: any = { isPublic: true };
  if (params.taskId) {
    where.taskId = params.taskId;
  }

  const [workflows, total] = await Promise.all([
    prisma.workflow.findMany({
      where,
      take: params.limit,
      skip: params.offset,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
      include: { tools: { include: { tool: true } }, task: true },
    }),
    prisma.workflow.count({ where }),
  ]);

  return { workflows, total };
}

export async function getWorkflowById(id: string) {
  return prisma.workflow.findUnique({
    where: { id },
    include: {
      tools: { include: { tool: true } },
      task: true,
      creator: { select: { id: true, name: true, avatar: true } },
    },
  });
}

export async function getWorkflowTools(workflowId: string) {
  return prisma.workflowTool.findMany({
    where: { workflowId },
    include: { tool: true },
    orderBy: { order: 'asc' },
  });
}

export async function createWorkflow(data: any) {
  const { tools, ...workflowData } = data;
  return prisma.workflow.create({
    data: {
      ...workflowData,
      tools: tools
        ? { create: tools.map((t: any, i: number) => ({ toolId: t.toolId, order: t.order || i })) }
        : undefined,
    },
    include: { tools: { include: { tool: true } } },
  });
}

export async function updateWorkflow(id: string, data: any) {
  const { tools, ...workflowData } = data;
  return prisma.workflow.update({
    where: { id },
    data: workflowData,
  });
}

export async function deleteWorkflow(id: string) {
  return prisma.workflow.delete({ where: { id } });
}

export async function saveWorkflow(userId: string, workflowId: string) {
  return prisma.savedWorkflow.create({
    data: { userId, workflowId },
  });
}

export async function unsaveWorkflow(userId: string, workflowId: string) {
  return prisma.savedWorkflow.delete({
    where: { userId_workflowId: { userId, workflowId } },
  });
}

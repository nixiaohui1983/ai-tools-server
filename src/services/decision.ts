import { PrismaClient } from '@prisma/client';
import { getQueryString } from '../utils/query';

const prisma = new PrismaClient();

export interface RecommendToolsParams {
  task?: string;
  budget?: number;
  categories?: string[];
  capabilities?: string[];
}

export async function recommendTools(params: RecommendToolsParams) {
  const where: any = {};

  if (params.categories && params.categories.length > 0) {
    where.categories = { hasSome: params.categories };
  }

  if (params.capabilities && params.capabilities.length > 0) {
    where.capabilities = {
      some: { name: { in: params.capabilities } },
    };
  }

  if (params.budget !== undefined) {
    where.OR = [
      { pricing: 'free' },
      { pricing: 'freemium' },
      { price: { lte: params.budget } },
    ];
  }

  // If task is provided, find related tasks and their workflows
  let taskTools: string[] = [];
  if (params.task) {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: params.task, mode: 'insensitive' } },
          { description: { contains: params.task, mode: 'insensitive' } },
        ],
      },
      include: {
        workflows: {
          include: {
            tools: {
              include: { tool: true },
            },
          },
        },
      },
    });

    for (const task of tasks) {
      for (const wf of task.workflows) {
        for (const wt of wf.tools) {
          taskTools.push(wt.toolId);
        }
      }
    }
  }

  const tools = await prisma.tool.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
    take: 10,
    include: { capabilities: true },
  });

  // Boost tools that appear in task workflows
  const toolMap = new Map(tools.map((t: any) => [t.id, t]));
  for (const toolId of taskTools) {
    const tool = toolMap.get(toolId);
    if (tool) (tool as any).relevanceScore = ((tool as any).relevanceScore || 0) + 1;
  }

  return tools.map((t: any) => ({
    ...t,
    relevanceScore: (t as any).relevanceScore || 0,
  }));
}

export async function compareTools(toolIds: string[]) {
  const tools = await prisma.tool.findMany({
    where: { id: { in: toolIds } },
    include: { capabilities: true },
  });

  const capabilities = ['writing', 'coding', 'image-generation', 'video', 'automation', 'research'];
  const comparison: any = {
    tools: tools.map((t: any) => ({
      id: t.id,
      name: t.name,
      pricing: t.pricing,
      price: t.price,
      rating: t.rating,
    })),
    matrix: {} as Record<string, Record<string, number>>,
  };

  for (const cap of capabilities) {
    comparison.matrix[cap] = {};
    for (const tool of tools) {
      const hasCap = (tool as any).capabilities.some((c: any) => c.name === cap);
      comparison.matrix[cap][(tool as any).id] = hasCap ? 1 : 0;
    }
  }

  return comparison;
}

export async function generateWorkflow(taskId: string, _preferences?: any) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      workflows: {
        include: {
          tools: {
            include: { tool: true },
          },
        },
      },
    },
  });

  if (!task) throw new Error('Task not found');

  const workflows = (task as any).workflows || [];
  if (workflows.length > 0) {
    // Return the best matching workflow template
    const best = workflows.sort(
      (a: any, b: any) => (b as any).featured - (a as any).featured
    )[0];
    if (best) return best;
  }

  // Generate a basic workflow from task's tools
  return {
    name: `Workflow for ${(task as any).title}`,
    nodes: [],
    edges: [],
    tools: [],
    estimatedCost: 0,
    estimatedTime: (task as any).toolCount * 30,
  };
}

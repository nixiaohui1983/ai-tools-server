import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ListToolsParams {
  category?: string;
  search?: string;
  limit: number;
  offset: number;
}

export async function listTools(params: ListToolsParams) {
  const where: any = {};
  if (params.category) {
    where.categories = { has: params.category };
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      take: params.limit,
      skip: params.offset,
      orderBy: { featured: 'desc' },
      include: { capabilities: true },
    }),
    prisma.tool.count({ where }),
  ]);

  return { tools, total };
}

export async function getToolById(id: string) {
  return prisma.tool.findUnique({
    where: { id },
    include: {
      capabilities: true,
      relationsAsSource: { include: { targetTool: true } },
      relationsAsTarget: { include: { sourceTool: true } },
      workflows: { include: { workflow: true } },
    },
  });
}

export async function getToolRelations(toolId: string) {
  const relations = await prisma.toolRelation.findMany({
    where: {
      OR: [{ sourceToolId: toolId }, { targetToolId: toolId }],
    },
    include: {
      sourceTool: { select: { id: true, name: true, logo: true } },
      targetTool: { select: { id: true, name: true, logo: true } },
    },
  });

  // Format as graph data
  const nodes = new Map<string, any>();
  const edges: any[] = [];

  // Add center tool
  const centerTool = await prisma.tool.findUnique({ where: { id: toolId } });
  if (centerTool) {
    nodes.set(toolId, { id: centerTool.id, name: centerTool.name, isCenter: true });
  }

  for (const rel of relations) {
    if (!nodes.has(rel.sourceToolId)) {
      nodes.set(rel.sourceToolId, { id: rel.sourceTool.id, name: rel.sourceTool.name });
    }
    if (!nodes.has(rel.targetToolId)) {
      nodes.set(rel.targetToolId, { id: rel.targetTool.id, name: rel.targetTool.name });
    }
    edges.push({
      source: rel.sourceToolId,
      target: rel.targetToolId,
      relationType: rel.relationType,
    });
  }

  return { nodes: Array.from(nodes.values()), edges };
}

export async function getToolAlternatives(toolId: string) {
  return prisma.toolRelation.findMany({
    where: {
      OR: [{ sourceToolId: toolId }, { targetToolId: toolId }],
      relationType: 'alternative',
    },
    include: {
      sourceTool: true,
      targetTool: true,
    },
  });
}

export async function createTool(data: any) {
  return prisma.tool.create({
    data: {
      ...data,
      id: undefined,
    },
  });
}

export async function updateTool(id: string, data: any) {
  return prisma.tool.update({
    where: { id },
    data,
  });
}

export async function deleteTool(id: string) {
  return prisma.tool.delete({ where: { id } });
}

export async function saveTool(userId: string, toolId: string) {
  return prisma.savedTool.create({
    data: { userId, toolId },
  });
}

export async function unsaveTool(userId: string, toolId: string) {
  return prisma.savedTool.delete({
    where: { userId_toolId: { userId, toolId } },
  });
}

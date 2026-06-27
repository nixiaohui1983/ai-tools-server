import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ListArticlesParams {
  category?: string;
  limit: number;
  offset: number;
  published: boolean;
}

export async function listArticles(params: ListArticlesParams) {
  const where: any = {};
  if (params.category) where.category = params.category;
  if (params.published) where.published = true;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      take: params.limit,
      skip: params.offset,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: { workflow: true, tools: { include: { tool: true } } },
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total };
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: { workflow: true, tools: { include: { tool: true } } },
  });
}

export async function getArticlesByCategory(category: string) {
  return prisma.article.findMany({
    where: { category, published: true },
    orderBy: { createdAt: 'desc' },
    include: { workflow: true },
  });
}

export async function createArticle(data: any) {
  const { tools, ...articleData } = data;
  return prisma.article.create({
    data: {
      ...articleData,
      tools: tools
        ? { create: tools.map((t: any) => ({ toolId: t.toolId })) }
        : undefined,
    },
  });
}

export async function updateArticle(id: string, data: any) {
  const { tools, ...articleData } = data;
  return prisma.article.update({
    where: { id },
    data: articleData,
  });
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}

export async function publishArticle(id: string) {
  return prisma.article.update({
    where: { id },
    data: { published: true, publishedAt: new Date() },
  });
}

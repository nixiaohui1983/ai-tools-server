import { Request, Response } from 'express';
import * as articleService from '../services/articles';
import { getQueryString, getQueryNumber, getQueryBoolean } from '../utils/query';

export const listArticles = async (req: Request, res: Response) => {
  try {
    const category = getQueryString(req.query['category']);
    const limit = getQueryNumber(req.query['limit'], 20);
    const offset = getQueryNumber(req.query['offset'], 0);
    const published = getQueryBoolean(req.query['published'], true);
    const result = await articleService.listArticles({ category, limit, offset, published });
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const article = await articleService.getArticleById(id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ data: article });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getArticlesByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params['category'] as string;
    const articles = await articleService.getArticlesByCategory(category);
    res.json({ data: articles });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const article = await articleService.createArticle(req.body);
    res.status(201).json({ data: article });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const article = await articleService.updateArticle(id, req.body);
    res.json({ data: article });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await articleService.deleteArticle(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const publishArticle = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const article = await articleService.publishArticle(id);
    res.json({ data: article });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

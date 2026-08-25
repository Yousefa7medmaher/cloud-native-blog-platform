import { Response } from 'express';
import slugify from 'slugify';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { Category } from '../models/Category';
import { Tag } from '../models/Tag';
import { ApiError } from '../utils/ApiError';

export const listCategories = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(ApiResponse.ok('Categories retrieved', { categories }));
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const existing = await Category.findOne({ $or: [{ name }, { slug }] });
  if (existing) throw new ApiError(409, 'Category already exists');

  const category = await Category.create({ name, slug, description });
  res.status(201).json(ApiResponse.ok('Category created', { category }));
});

export const listTags = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.json(ApiResponse.ok('Tags retrieved', { tags }));
});

export const createTag = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const existing = await Tag.findOne({ slug });
  if (existing) throw new ApiError(409, 'Tag already exists');

  const tag = await Tag.create({ name, slug });
  res.status(201).json(ApiResponse.ok('Tag created', { tag }));
});

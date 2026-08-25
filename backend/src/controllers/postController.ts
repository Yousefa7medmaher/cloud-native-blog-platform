import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostBySlug,
  getPostById,
  toggleLike,
  getUserAnalytics,
} from '../services/postService';
import { getParam } from '../utils/params';

export const listPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tags = typeof req.query.tags === 'string' ? req.query.tags : undefined;
  const result = await getPosts({
    search: req.query.search as string,
    category: req.query.category as string,
    tags,
    status: req.query.status as string,
    author: req.query.author as string,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    sort: req.query.sort as string,
    userId: req.user?.id,
  });
  res.json(ApiResponse.ok('Posts retrieved', result.posts, {
    total: result.total,
    page: result.page,
    pages: result.pages,
  }));
});

export const getBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await getPostBySlug(getParam(req.params.slug), req.user?.id);
  res.json(ApiResponse.ok('Post retrieved', { post }));
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user?.role === 'admin';
  const post = await getPostById(getParam(req.params.id), req.user?.id, isAdmin);
  res.json(ApiResponse.ok('Post retrieved', { post }));
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await createPost(req.user!.id, req.body);
  res.status(201).json(ApiResponse.ok('Post created', { post }));
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user!.role === 'admin';
  const post = await updatePost(getParam(req.params.id), req.user!.id, isAdmin, req.body);
  res.json(ApiResponse.ok('Post updated', { post }));
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user!.role === 'admin';
  await deletePost(getParam(req.params.id), req.user!.id, isAdmin);
  res.json(ApiResponse.ok('Post deleted'));
});

export const like = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await toggleLike(getParam(req.params.id), req.user!.id);
  res.json(ApiResponse.ok(result.liked ? 'Post liked' : 'Post unliked', result));
});

export const analytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await getUserAnalytics(req.user!.id);
  res.json(ApiResponse.ok('Analytics retrieved', data));
});

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} from '../services/commentService';
import { getParam } from '../utils/params';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await createComment(req.user!.id, req.body);
  res.status(201).json(ApiResponse.ok('Comment created', { comment }));
});

export const listByPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getPostComments(
    getParam(req.params.postId),
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  res.json(ApiResponse.ok('Comments retrieved', result.comments, {
    total: result.total,
    page: result.page,
    pages: result.pages,
  }));
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await updateComment(getParam(req.params.id), req.user!.id, req.body.content);
  res.json(ApiResponse.ok('Comment updated', { comment }));
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user!.role === 'admin';
  await deleteComment(getParam(req.params.id), req.user!.id, isAdmin);
  res.json(ApiResponse.ok('Comment deleted'));
});

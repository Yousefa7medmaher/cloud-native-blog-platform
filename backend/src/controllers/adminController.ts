import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { sanitizeUser } from '../services/authService';
import { deletePost, updatePost } from '../services/postService';
import { moderateComment, deleteComment } from '../services/commentService';
import { ApiError } from '../utils/ApiError';
import { getParam } from '../utils/params';

export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [totalUsers, totalPosts, totalComments, latestUsers, latestPosts] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
    Post.find()
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json(
    ApiResponse.ok('Dashboard stats retrieved', {
      totalUsers,
      totalPosts,
      totalComments,
      latestUsers: latestUsers.map(sanitizeUser),
      latestPosts,
    }),
  );
});

export const listUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = (req.query.search as string) || '';

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json(ApiResponse.ok('Users retrieved', users.map(sanitizeUser), {
    total,
    page,
    pages: Math.ceil(total / limit),
  }));
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user._id.toString() === req.user!.id) {
    throw new ApiError(400, 'Cannot delete your own account');
  }
  await Post.deleteMany({ author: user._id });
  await Comment.deleteMany({ author: user._id });
  await user.deleteOne();
  res.json(ApiResponse.ok('User deleted'));
});

export const suspendUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isSuspended: req.body.isSuspended },
    { returnDocument: 'after' },
  );
  if (!user) throw new ApiError(404, 'User not found');
  res.json(ApiResponse.ok('User updated', { user: sanitizeUser(user) }));
});

export const promoteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { returnDocument: 'after' });
  if (!user) throw new ApiError(404, 'User not found');
  res.json(ApiResponse.ok('User role updated', { user: sanitizeUser(user) }));
});

export const listAllPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find()
      .populate('author', 'name username avatar')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments(),
  ]);

  res.json(ApiResponse.ok('Posts retrieved', posts, {
    total,
    page,
    pages: Math.ceil(total / limit),
  }));
});

export const adminUpdatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await updatePost(getParam(req.params.id), req.user!.id, true, req.body);
  res.json(ApiResponse.ok('Post updated', { post }));
});

export const adminDeletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deletePost(getParam(req.params.id), req.user!.id, true);
  res.json(ApiResponse.ok('Post deleted'));
});

export const adminModerateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await moderateComment(getParam(req.params.id), req.body);
  res.json(ApiResponse.ok('Comment moderated', { comment }));
});

export const adminDeleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteComment(getParam(req.params.id), req.user!.id, true);
  res.json(ApiResponse.ok('Comment deleted'));
});

export const listAllComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find()
      .populate('author', 'name username avatar')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(),
  ]);

  res.json(ApiResponse.ok('Comments retrieved', comments, {
    total,
    page,
    pages: Math.ceil(total / limit),
  }));
});

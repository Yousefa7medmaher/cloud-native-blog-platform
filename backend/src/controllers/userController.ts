import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { User } from '../models/User';
import { sanitizeUser } from '../services/authService';
import { ApiError } from '../utils/ApiError';
import { getParam } from '../utils/params';

export const getUserByUsername = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findOne({ username: getParam(req.params.username).toLowerCase() });
  if (!user || user.isSuspended) throw new ApiError(404, 'User not found');
  res.json(ApiResponse.ok('User retrieved', { user: sanitizeUser(user) }));
});

export const getMyNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { getUserNotifications } = await import('../services/notificationService');
  const result = await getUserNotifications(
    req.user!.id,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  res.json(ApiResponse.ok('Notifications retrieved', result.notifications, {
    total: result.total,
    page: result.page,
    pages: result.pages,
  }));
});

export const markRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { markNotificationsRead } = await import('../services/notificationService');
  await markNotificationsRead(req.user!.id, req.body.ids);
  res.json(ApiResponse.ok('Notifications marked as read'));
});

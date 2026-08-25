import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  updateUserProfile,
  sanitizeUser,
} from '../services/authService';
import { getRefreshCookieOptions } from '../utils/jwt';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { uploadToS3 } from '../services/s3Service';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await registerUser(req.body);
  res.status(201).json(ApiResponse.ok('Registration successful', { user }));
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, rememberMe = false } = req.body;
  const result = await loginUser(email, password, rememberMe);

  res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions(rememberMe));
  res.json(
    ApiResponse.ok('Login successful', {
      user: result.user,
      accessToken: result.accessToken,
    }),
  );
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');

  const tokens = await refreshAccessToken(token);
  res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
  res.json(ApiResponse.ok('Token refreshed', { accessToken: tokens.accessToken }));
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) await logoutUser(req.user.id);
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json(ApiResponse.ok('Logged out successfully'));
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(ApiResponse.ok('Profile retrieved', { user: sanitizeUser(user) }));
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await updateUserProfile(req.user!.id, req.body);
  res.json(ApiResponse.ok('Profile updated', { user }));
});

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await changePassword(req.user!.id, currentPassword, newPassword);
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json(ApiResponse.ok('Password changed successfully'));
});

export const uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) throw new ApiError(400, 'Avatar file is required');
  const { url } = await uploadToS3(req.file, req.user!.id, 'avatars');
  const user = await updateUserProfile(req.user!.id, { avatar: url });
  res.json(ApiResponse.ok('Avatar uploaded', { user }));
});

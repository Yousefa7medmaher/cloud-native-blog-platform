import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { ApiError } from '../utils/ApiError';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

const SALT_ROUNDS = 12;

export const sanitizeUser = (user: IUser) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  bio: user.bio,
  avatar: user.avatar,
  role: user.role,
  isSuspended: user.isSuspended,
  createdAt: user.createdAt,
});

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  username: string;
}) => {
  const existing = await User.findOne({
    $or: [{ email: data.email }, { username: data.username.toLowerCase() }],
  });
  if (existing) {
    throw new ApiError(409, 'Email or username already in use');
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await User.create({
    ...data,
    username: data.username.toLowerCase(),
    password: hashedPassword,
  });

  return sanitizeUser(user);
};

export const loginUser = async (
  email: string,
  password: string,
  rememberMe = false,
) => {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (user.isSuspended) throw new ApiError(403, 'Account suspended');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: sanitizeUser(user), ...tokens, rememberMe };
};

export const generateTokens = (user: IUser) => {
  const payload = { userId: user._id.toString(), role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.userId).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken || user.isSuspended) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });
  return tokens;
};

export const logoutUser = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new ApiError(400, 'Current password is incorrect');

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.refreshToken = undefined;
  await user.save();
};

export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; bio?: string; username?: string; avatar?: string },
) => {
  if (updates.username) {
    const existing = await User.findOne({
      username: updates.username.toLowerCase(),
      _id: { $ne: userId },
    });
    if (existing) throw new ApiError(409, 'Username already taken');
    updates.username = updates.username.toLowerCase();
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  return sanitizeUser(user);
};

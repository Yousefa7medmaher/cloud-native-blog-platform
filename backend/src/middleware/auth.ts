import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'user';
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select('_id role isSuspended');
    if (!user || user.isSuspended) {
      throw new ApiError(401, 'Invalid or suspended account');
    }
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    next();
    return;
  }
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select('_id role isSuspended');
    if (user && !user.isSuspended) {
      req.user = { id: user._id.toString(), role: user.role };
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};

export const authorize = (...roles: Array<'admin' | 'user'>) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Insufficient permissions');
    }
    next();
  };
};

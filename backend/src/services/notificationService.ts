import { Types } from 'mongoose';
import { Notification } from '../models/Notification';

interface CreateNotificationParams {
  recipientId: string;
  senderId?: string;
  type: 'like' | 'comment' | 'reply' | 'system';
  message: string;
  postId?: string;
  commentId?: string;
}

export const createNotification = async (params: CreateNotificationParams): Promise<void> => {
  if (params.senderId && params.senderId === params.recipientId) return;

  await Notification.create({
    recipient: new Types.ObjectId(params.recipientId),
    sender: params.senderId ? new Types.ObjectId(params.senderId) : undefined,
    type: params.type,
    message: params.message,
    post: params.postId ? new Types.ObjectId(params.postId) : undefined,
    comment: params.commentId ? new Types.ObjectId(params.commentId) : undefined,
  });
};

export const getUserNotifications = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: userId })
      .populate('sender', 'name username avatar')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ recipient: userId }),
  ]);
  return { notifications, total, page, pages: Math.ceil(total / limit) };
};

export const markNotificationsRead = async (userId: string, ids?: string[]) => {
  const filter: Record<string, unknown> = { recipient: userId, isRead: false };
  if (ids?.length) filter._id = { $in: ids };
  await Notification.updateMany(filter, { isRead: true });
};

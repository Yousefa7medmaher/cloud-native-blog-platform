import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { ApiError } from '../utils/ApiError';
import { createNotification } from './notificationService';

export const createComment = async (
  authorId: string,
  data: { content: string; post: string; parent?: string },
) => {
  const post = await Post.findById(data.post);
  if (!post || post.status !== 'published') throw new ApiError(404, 'Post not found');

  if (data.parent) {
    const parentComment = await Comment.findById(data.parent);
    if (!parentComment || parentComment.post.toString() !== data.post) {
      throw new ApiError(400, 'Invalid parent comment');
    }
  }

  const comment = await Comment.create({
    content: data.content,
    post: data.post,
    author: authorId,
    parent: data.parent,
  });

  post.commentCount += 1;
  await post.save();

  const populated = await comment.populate('author', 'name username avatar');

  await createNotification({
    recipientId: post.author.toString(),
    senderId: authorId,
    type: data.parent ? 'reply' : 'comment',
    message: data.parent ? 'replied to a comment on your post' : 'commented on your post',
    postId: post._id.toString(),
    commentId: comment._id.toString(),
  });

  if (data.parent) {
    const parent = await Comment.findById(data.parent);
    if (parent && parent.author.toString() !== authorId) {
      await createNotification({
        recipientId: parent.author.toString(),
        senderId: authorId,
        type: 'reply',
        message: 'replied to your comment',
        postId: post._id.toString(),
        commentId: comment._id.toString(),
      });
    }
  }

  return populated;
};

export const getPostComments = async (postId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const filter = { post: postId, parent: { $exists: false }, isHidden: false };

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(filter),
  ]);

  const commentIds = comments.map((c) => c._id);
  const replies = await Comment.find({
    parent: { $in: commentIds },
    isHidden: false,
  })
    .populate('author', 'name username avatar')
    .sort({ createdAt: 1 });

  const repliesMap = replies.reduce<Record<string, typeof replies>>((acc, reply) => {
    const parentId = reply.parent!.toString();
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(reply);
    return acc;
  }, {});

  const enriched = comments.map((c) => ({
    ...c.toObject(),
    replies: repliesMap[c._id.toString()] || [],
  }));

  return { comments: enriched, total, page, pages: Math.ceil(total / limit) };
};

export const updateComment = async (commentId: string, userId: string, content: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (comment.author.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to update this comment');
  }
  comment.content = content;
  await comment.save();
  return comment.populate('author', 'name username avatar');
};

export const deleteComment = async (commentId: string, userId: string, isAdmin = false) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (!isAdmin && comment.author.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to delete this comment');
  }

  const replyCount = await Comment.countDocuments({ parent: commentId });
  await Comment.deleteMany({ $or: [{ _id: commentId }, { parent: commentId }] });

  const post = await Post.findById(comment.post);
  if (post) {
    post.commentCount = Math.max(0, post.commentCount - 1 - replyCount);
    await post.save();
  }
};

export const moderateComment = async (
  commentId: string,
  updates: { isHidden?: boolean; isModerated?: boolean },
) => {
  const comment = await Comment.findByIdAndUpdate(commentId, updates, { returnDocument: 'after' }).populate(
    'author',
    'name username avatar',
  );
  if (!comment) throw new ApiError(404, 'Comment not found');
  return comment;
};

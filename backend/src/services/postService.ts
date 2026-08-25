import { Types } from 'mongoose';
import { Post, IPost } from '../models/Post';
import { Like } from '../models/Like';
import { Tag } from '../models/Tag';
import { Category } from '../models/Category';
import { ApiError } from '../utils/ApiError';
import { generateUniqueSlug } from '../utils/slugify';
import { calculateReadingTime } from '../utils/readingTime';
import { createNotification } from './notificationService';
import slugifyLib from 'slugify';

const populateOptions = [
  { path: 'author', select: 'name username avatar bio' },
  { path: 'category', select: 'name slug' },
  { path: 'tags', select: 'name slug' },
];

export const resolveTags = async (tagIds?: string[], tagNames?: string[]) => {
  const ids: Types.ObjectId[] = [];

  if (tagIds?.length) {
    ids.push(...tagIds.map((id) => new Types.ObjectId(id)));
  }

  if (tagNames?.length) {
    for (const name of tagNames) {
      const slug = slugifyLib(name, { lower: true, strict: true });
      let tag = await Tag.findOne({ slug });
      if (!tag) {
        tag = await Tag.create({ name, slug });
      }
      ids.push(tag._id);
    }
  }

  return ids;
};

export const createPost = async (
  authorId: string,
  data: Partial<IPost> & { tagNames?: string[] },
) => {
  const category = await Category.findById(data.category);
  if (!category) throw new ApiError(400, 'Category not found');

  const slug = await generateUniqueSlug(data.title!);
  const tags = await resolveTags(
    data.tags?.map((t) => t.toString()),
    data.tagNames,
  );
  const status = data.status || 'draft';

  const post = await Post.create({
    title: data.title,
    subtitle: data.subtitle,
    slug,
    description: data.description,
    content: data.content,
    featuredImage: data.featuredImage,
    images: data.images || [],
    video: data.video,
    category: data.category,
    tags,
    author: authorId,
    status,
    publishedAt: status === 'published' ? new Date() : undefined,
    readingTime: calculateReadingTime(data.content!),
  });

  return post.populate(populateOptions);
};

export const updatePost = async (
  postId: string,
  userId: string,
  isAdmin: boolean,
  data: Partial<IPost> & { tagNames?: string[] },
) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');
  if (!isAdmin && post.author.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to update this post');
  }

  if (data.title && data.title !== post.title) {
    post.slug = await generateUniqueSlug(data.title, postId);
    post.title = data.title;
  }

  const fields = [
    'subtitle',
    'description',
    'content',
    'featuredImage',
    'images',
    'video',
    'category',
    'status',
  ] as const;

  for (const field of fields) {
    if (data[field] !== undefined) {
      (post as unknown as Record<string, unknown>)[field] = data[field];
    }
  }

  if (data.tags || data.tagNames) {
    post.tags = await resolveTags(
      data.tags?.map((t) => t.toString()),
      data.tagNames,
    );
  }

  if (data.content) {
    post.readingTime = calculateReadingTime(data.content);
  }

  if (data.status === 'published' && !post.publishedAt) {
    post.publishedAt = new Date();
  }

  await post.save();
  return post.populate(populateOptions);
};

export const deletePost = async (postId: string, userId: string, isAdmin: boolean) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');
  if (!isAdmin && post.author.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to delete this post');
  }
  await Like.deleteMany({ post: postId });
  await post.deleteOne();
};

export const getPosts = async (query: {
  search?: string;
  category?: string;
  tags?: string;
  status?: string;
  author?: string;
  page?: number;
  limit?: number;
  sort?: string;
  userId?: string;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.category) filter.category = query.category;
  if (query.tags) {
    const tagIds = query.tags.split(',').filter(Boolean);
    if (tagIds.length) filter.tags = { $in: tagIds };
  }
  if (query.status) {
    filter.status = query.status;
  } else if (!query.author) {
    filter.status = 'published';
  }
  if (query.author) filter.author = query.author;

  let sort: Record<string, 1 | -1 | { $meta: string }> = { publishedAt: -1 };
  if (query.sort === 'popular') sort = { likeCount: -1 };
  if (query.sort === 'views') sort = { views: -1 };
  if (query.search) sort = { score: { $meta: 'textScore' }, publishedAt: -1 };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate(populateOptions)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  let likedPostIds: string[] = [];
  if (query.userId && posts.length) {
    const likes = await Like.find({
      user: query.userId,
      post: { $in: posts.map((p) => p._id) },
    }).select('post');
    likedPostIds = likes.map((l) => l.post.toString());
  }

  const enriched = posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.includes(post._id.toString()),
  }));

  return { posts: enriched, total, page, pages: Math.ceil(total / limit) };
};

export const getPostBySlug = async (slug: string, userId?: string) => {
  const post = await Post.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { views: 1 } },
    { returnDocument: 'after' },
  ).populate(populateOptions);

  if (!post) throw new ApiError(404, 'Post not found');

  let isLiked = false;
  if (userId) {
    const like = await Like.findOne({ user: userId, post: post._id });
    isLiked = Boolean(like);
  }

  return { ...post.toObject(), isLiked };
};

export const getPostById = async (postId: string, userId?: string, isAdmin = false) => {
  const post = await Post.findById(postId).populate(populateOptions);
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.status === 'draft' && post.author.toString() !== userId && !isAdmin) {
    throw new ApiError(404, 'Post not found');
  }

  let isLiked = false;
  if (userId) {
    const like = await Like.findOne({ user: userId, post: post._id });
    isLiked = Boolean(like);
  }

  return { ...post.toObject(), isLiked };
};

export const toggleLike = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post || post.status !== 'published') throw new ApiError(404, 'Post not found');

  const existing = await Like.findOne({ user: userId, post: postId });
  if (existing) {
    await existing.deleteOne();
    post.likeCount = Math.max(0, post.likeCount - 1);
    await post.save();
    return { liked: false, likeCount: post.likeCount };
  }

  await Like.create({ user: userId, post: postId });
  post.likeCount += 1;
  await post.save();

  await createNotification({
    recipientId: post.author.toString(),
    senderId: userId,
    type: 'like',
    message: 'liked your post',
    postId: post._id.toString(),
  });

  return { liked: true, likeCount: post.likeCount };
};

export const getUserAnalytics = async (userId: string) => {
  const posts = await Post.find({ author: userId });
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likeCount, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.commentCount, 0);
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;

  return {
    totalPosts: posts.length,
    published,
    drafts,
    totalViews,
    totalLikes,
    totalComments,
    recentPosts: posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5),
  };
};

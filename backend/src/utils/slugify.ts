import slugifyLib from 'slugify';
import { Post } from '../models/Post';

export const generateSlug = (title: string): string =>
  slugifyLib(title, { lower: true, strict: true, trim: true });

export const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  let base = generateSlug(title) || 'post';
  let slug = base;
  let counter = 1;

  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Post.findOne(query).select('_id');
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
};

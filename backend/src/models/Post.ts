import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  subtitle?: string;
  slug: string;
  description?: string;
  content: string;
  featuredImage?: string;
  images: string[];
  video?: string;
  category: Types.ObjectId;
  tags: Types.ObjectId[];
  author: Types.ObjectId;
  status: 'draft' | 'published';
  publishedAt?: Date;
  readingTime: number;
  views: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subtitle: { type: String, trim: true, maxlength: 300 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, maxlength: 500 },
    content: { type: String, required: true },
    featuredImage: { type: String },
    images: [{ type: String }],
    video: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

postSchema.index({ slug: 1 });
postSchema.index({ title: 'text', description: 'text', content: 'text' });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ author: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);

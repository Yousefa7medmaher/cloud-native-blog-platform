import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  username: string;
  bio?: string;
  avatar?: string;
  role: 'admin' | 'user';
  isSuspended: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio: { type: String, maxlength: 500 },
    avatar: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isSuspended: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model<IUser>('User', userSchema);

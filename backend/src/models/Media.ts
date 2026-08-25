import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  key: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Media = mongoose.model<IMedia>('Media', mediaSchema);
import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected');
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

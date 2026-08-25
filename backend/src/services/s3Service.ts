import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { s3Client, isS3Configured } from '../config/s3';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { Media } from '../models/Media';

const getExtension = (filename: string, mimetype: string): string => {
  const ext = path.extname(filename);
  if (ext) return ext;
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
  };
  return map[mimetype] || '';
};

export const uploadToS3 = async (
  file: Express.Multer.File,
  userId: string,
  folder = 'uploads',
): Promise<{ url: string; key: string; type: 'image' | 'video' }> => {
  if (!isS3Configured()) {
    throw new ApiError(503, 'File upload service is not configured');
  }

  const ext = getExtension(file.originalname, file.mimetype);
  const key = `${folder}/${userId}/${uuidv4()}${ext}`;
  const isVideo = file.mimetype.startsWith('video/');

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.aws.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown S3 upload error';
    const errorName = error instanceof Error ? error.name : '';

    if (errorName === 'SignatureDoesNotMatch' || errorName === 'RequestTimeTooSkewed') {
      throw new ApiError(
        502,
        'S3 upload failed: AWS credentials, region, or clock are incorrect. Check AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION.',
      );
    }

    throw new ApiError(502, `S3 upload failed: ${message}`);
  }

  const url = `https://${env.aws.bucketName}.s3.${env.aws.region}.amazonaws.com/${key}`;

  await Media.create({
    url,
    key,
    type: isVideo ? 'video' : 'image',
    mimeType: file.mimetype,
    size: file.size,
    uploadedBy: userId,
  });

  return { url, key, type: isVideo ? 'video' : 'image' };
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  if (!isS3Configured() || !key) return;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.aws.bucketName,
      Key: key,
    }),
  );
};

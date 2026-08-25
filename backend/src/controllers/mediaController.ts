import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { uploadToS3 } from '../services/s3Service';
import { ApiError } from '../utils/ApiError';

export const uploadFile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) throw new ApiError(400, 'File is required');
  const folder = req.body.folder || 'uploads';
  const result = await uploadToS3(req.file, req.user!.id, folder);
  res.status(201).json(ApiResponse.ok('File uploaded', result));
});

export const uploadFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) throw new ApiError(400, 'At least one file is required');

  const folder = req.body.folder || 'uploads';
  const results = await Promise.all(files.map((file) => uploadToS3(file, req.user!.id, folder)));
  res.status(201).json(ApiResponse.ok('Files uploaded', { files: results }));
});

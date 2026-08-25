import { body, param } from 'express-validator';

export const createCommentValidator = [
  body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 2000 }),
  body('post').isMongoId().withMessage('Valid post ID is required'),
  body('parent').optional().isMongoId(),
];

export const updateCommentValidator = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
  body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 2000 }),
];

export const commentIdParam = [param('id').isMongoId().withMessage('Invalid comment ID')];
export const postCommentsParam = [param('postId').isMongoId().withMessage('Invalid post ID')];

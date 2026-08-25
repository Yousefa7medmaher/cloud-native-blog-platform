import { body, param, query } from 'express-validator';

export const createPostValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('subtitle').optional().trim().isLength({ max: 300 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').isMongoId().withMessage('Valid category is required'),
  body('tags').optional().isArray(),
  body('tags.*').optional().isMongoId(),
  body('featuredImage').optional().isURL(),
  body('images').optional().isArray(),
  body('images.*').optional().isURL(),
  body('video').optional().isURL(),
  body('status').optional().isIn(['draft', 'published']),
];

export const updatePostValidator = [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('subtitle').optional().trim().isLength({ max: 300 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('content').optional().notEmpty(),
  body('category').optional().isMongoId(),
  body('tags').optional().isArray(),
  body('tags.*').optional().isMongoId(),
  body('featuredImage').optional().isURL(),
  body('images').optional().isArray(),
  body('video').optional().isURL(),
  body('status').optional().isIn(['draft', 'published']),
];

export const postIdParam = [param('id').isMongoId().withMessage('Invalid post ID')];
export const slugParam = [param('slug').trim().notEmpty().withMessage('Slug is required')];

export const searchPostsQuery = [
  query('search').optional().trim(),
  query('category').optional().isMongoId(),
  query('tags').optional(),
  query('status').optional().isIn(['draft', 'published']),
  query('author').optional().isMongoId(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('sort').optional().isIn(['newest', 'popular', 'views']),
];

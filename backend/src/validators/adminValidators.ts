import { body, param, query } from 'express-validator';

export const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 50 }),
  body('description').optional().trim().isLength({ max: 300 }),
];

export const userSearchQuery = [
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
];

export const suspendUserValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('isSuspended').isBoolean().withMessage('isSuspended must be a boolean'),
];

export const promoteUserValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
];

export const moderateCommentValidator = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
  body('isHidden').optional().isBoolean(),
  body('isModerated').optional().isBoolean(),
];

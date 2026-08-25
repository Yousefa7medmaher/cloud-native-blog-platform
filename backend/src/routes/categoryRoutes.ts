import { Router } from 'express';
import { listCategories, createCategory, listTags, createTag } from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCategoryValidator } from '../validators/adminValidators';
import { body } from 'express-validator';

const router = Router();

router.get('/', listCategories);
router.post('/', authenticate, authorize('admin'), createCategoryValidator, validate, createCategory);
router.get('/tags', listTags);
router.post(
  '/tags',
  authenticate,
  authorize('admin'),
  body('name').trim().notEmpty().withMessage('Tag name is required'),
  validate,
  createTag,
);

export default router;

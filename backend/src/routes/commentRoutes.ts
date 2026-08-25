import { Router } from 'express';
import { create, listByPost, update, remove } from '../controllers/commentController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createCommentValidator,
  updateCommentValidator,
  commentIdParam,
  postCommentsParam,
} from '../validators/commentValidators';
import { paginationQuery } from '../validators/authValidators';

const router = Router();

router.post('/', authenticate, createCommentValidator, validate, create);
router.get('/post/:postId', postCommentsParam, paginationQuery, validate, listByPost);
router.put('/:id', authenticate, updateCommentValidator, validate, update);
router.delete('/:id', authenticate, commentIdParam, validate, remove);

export default router;

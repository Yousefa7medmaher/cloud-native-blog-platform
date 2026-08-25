import { Router } from 'express';
import {
  listPosts,
  getBySlug,
  getById,
  create,
  update,
  remove,
  like,
  analytics,
} from '../controllers/postController';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createPostValidator,
  updatePostValidator,
  postIdParam,
  slugParam,
  searchPostsQuery,
} from '../validators/postValidators';

const router = Router();

router.get('/', searchPostsQuery, validate, optionalAuth, listPosts);
router.get('/analytics/me', authenticate, analytics);
router.get('/slug/:slug', slugParam, validate, optionalAuth, getBySlug);
router.get('/:id', postIdParam, validate, optionalAuth, getById);
router.post('/', authenticate, createPostValidator, validate, create);
router.put('/:id', authenticate, updatePostValidator, validate, update);
router.delete('/:id', authenticate, postIdParam, validate, remove);
router.post('/:id/like', authenticate, postIdParam, validate, like);

export default router;

import { Router } from 'express';
import {
  getDashboardStats,
  listUsers,
  deleteUser,
  suspendUser,
  promoteUser,
  listAllPosts,
  adminUpdatePost,
  adminDeletePost,
  adminModerateComment,
  adminDeleteComment,
  listAllComments,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  userSearchQuery,
  suspendUserValidator,
  promoteUserValidator,
  moderateCommentValidator,
} from '../validators/adminValidators';
import { mongoIdParam, paginationQuery } from '../validators/authValidators';
import { updatePostValidator } from '../validators/postValidators';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', userSearchQuery, validate, listUsers);
router.delete('/users/:id', mongoIdParam('id'), validate, deleteUser);
router.patch('/users/:id/suspend', suspendUserValidator, validate, suspendUser);
router.patch('/users/:id/role', promoteUserValidator, validate, promoteUser);
router.get('/posts', paginationQuery, validate, listAllPosts);
router.put('/posts/:id', updatePostValidator, validate, adminUpdatePost);
router.delete('/posts/:id', mongoIdParam('id'), validate, adminDeletePost);
router.get('/comments', paginationQuery, validate, listAllComments);
router.patch('/comments/:id', moderateCommentValidator, validate, adminModerateComment);
router.delete('/comments/:id', mongoIdParam('id'), validate, adminDeleteComment);

export default router;

import { Router } from 'express';
import { getUserByUsername, getMyNotifications, markRead } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { param } from 'express-validator';

const router = Router();

router.get('/notifications', authenticate, getMyNotifications);
router.patch('/notifications/read', authenticate, markRead);
router.get(
  '/:username',
  param('username').trim().notEmpty(),
  validate,
  getUserByUsername,
);

export default router;

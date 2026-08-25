import { Router } from 'express';
import authRoutes from './authRoutes';
import postRoutes from './postRoutes';
import commentRoutes from './commentRoutes';
import categoryRoutes from './categoryRoutes';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';
import mediaRoutes from './mediaRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/media', mediaRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'JooBlog API is running' });
});

export default router;

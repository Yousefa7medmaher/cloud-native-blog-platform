import { Router } from 'express';
import { uploadFile, uploadFiles } from '../controllers/mediaController';
import { authenticate } from '../middleware/auth';
import { uploadSingle, uploadMultiple } from '../middleware/upload';

const router = Router();

router.post('/upload', authenticate, uploadSingle, uploadFile);
router.post('/upload/multiple', authenticate, uploadMultiple, uploadFiles);

export default router;

import { Router } from 'express';
import documentsRouter from './documents.js';
import queryRouter from './query.js';

const router = Router();

router.use('/documents', documentsRouter);
router.use('/query', queryRouter);

export default router;

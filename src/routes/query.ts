import { Router } from 'express';
import { queryDocuments } from '../controllers/query.js';

const router = Router();

router.post('/', queryDocuments);

export default router;

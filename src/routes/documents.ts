import { Router } from 'express';
import { uploadDocument, getDocuments } from '../controllers/documents.js';

const router = Router();

router.post('/', uploadDocument);
router.get('/', getDocuments);

export default router;
import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, getDocuments } from '../controllers/documents.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/', upload.single('file'), uploadDocument);
router.get('/', getDocuments);

export default router;

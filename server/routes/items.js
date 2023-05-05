import express from 'express';
import { VerifyToken } from '../middleware/VerifyToken.js';
import { report } from '../controllers/items.js';
const router = express.Router();
import upload from '../utils/uploadImage.js';

router.post('/report', VerifyToken, upload.single('imageUrl'), report);

export default router;

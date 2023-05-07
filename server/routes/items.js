import express from 'express';
import { VerifyToken } from '../middleware/VerifyToken.js';
import {
  report,
  getReportedItems,
  getReportedItemById,
  updateReportedItem,
  deleteReportedIemById,
} from '../controllers/items.js';
const router = express.Router();
import upload from '../utils/uploadImage.js';
import { verify } from 'jsonwebtoken';

router.post('/report', VerifyToken, upload.single('image'), report);
router.get('/report', VerifyToken, getReportedItems);
router.get('/report/:id', VerifyToken, getReportedItemById);
router.patch('/report/:id', VerifyToken, updateReportedItem);
router.delete('/report/:id', VerifyToken, deleteReportedIemById);

export default router;

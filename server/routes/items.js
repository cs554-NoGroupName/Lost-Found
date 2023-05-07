import express from 'express';
import { VerifyToken } from '../middleware/VerifyToken.js';
import {
  report,
  getReportedItems,
  getReportedItemById,
  updateReportedItem,
  deleteReportedIemById,
} from '../controllers/items.js';

import { getAllItems, getItemsById } from './middleware/items.js';

const router = express.Router();
import upload from '../utils/uploadImage.js';

// router.post('/report', VerifyToken, upload.single('image'), report);
router.post('/report', VerifyToken, upload.single('imageUrl'), report);
router.get('/report', VerifyToken, getAllItems, getReportedItems);
router.get('/report/:id', VerifyToken, getItemsById, getReportedItemById);
router.patch('/report/:id', VerifyToken, updateReportedItem);
router.delete('/report/:id', VerifyToken, deleteReportedIemById);

export default router;

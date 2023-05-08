import express from 'express';
import { VerifyToken } from '../middleware/VerifyToken.js';
import {
  report,
  getReportedItems,
  getReportedItemById,
  updateReportedItem,
  deleteReportedIemById,
  claimRequest,
} from '../controllers/items.js';

import { getAllItems, getItemsById } from '../middleware/items.js';

const router = express.Router();
import upload from '../utils/uploadImage.js';

// router.post('/report', VerifyToken, upload.single('image'), report);
router.post('/report', VerifyToken, upload.single('imageUrl'), report);
router.get('/claim/:id', VerifyToken, claimRequest);
router.get('/', VerifyToken, getAllItems, getReportedItems);
router.get('/:id', VerifyToken, getItemsById, getReportedItemById);
router.patch('/:id', VerifyToken, updateReportedItem);
router.delete('/:id', VerifyToken, deleteReportedIemById);

export default router;

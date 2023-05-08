import express from 'express';
import { VerifyToken } from '../middleware/VerifyToken.js';
import {
  report,
  getReportedItems,
  getReportedItemById,
  updateReportedItem,
  deleteReportedIemById,
  // createClaimById,
  getReportedItemBySearch,
} from '../controllers/items.js';

import { getItemsById } from '../middleware/items.js';

const router = express.Router();
import upload from '../utils/uploadImage.js';

// router.post('/report', VerifyToken, upload.single('image'), report);
router.post('/', VerifyToken, upload.single('imageUrl'), report);
router.get('/', VerifyToken, getReportedItems);
// router.get('//search', VerifyToken, getReportedItemBySearch);
router.get('/:id', VerifyToken, getItemsById, getReportedItemById);
router.patch('/:id', VerifyToken, updateReportedItem);
router.delete('/:id', VerifyToken, deleteReportedIemById);
// router.post('/claim', VerifyToken, createClaimById);
router.get('/search', VerifyToken, getReportedItemBySearch);

export default router;

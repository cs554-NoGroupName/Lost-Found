import express from 'express';
import { VerifyToken } from '../middleware/VerifyToken.js';
import {
  report,
  getReportedItems,
  getReportedItemById,
  updateReportedItem,
  deleteReportedIemById,
  claimRequest,
  resolveClaim,
  getReportedItemBySearch,
  disputeRequest,
  rejectClaim,
  comment,
  commentDelete,
  updateImage,
} from '../controllers/items.js';

import { getItemsById } from '../middleware/items.js';

const router = express.Router();
import upload from '../utils/uploadImage.js';

// router.post('/report', VerifyToken, upload.single('image'), report);
router.post('/report', VerifyToken, upload.single('imageUrl'), report);
router.post('/image/:id', VerifyToken, upload.single('imageUrl'), updateImage);

router.get('/claim/:id', VerifyToken, claimRequest);
router.get('/resolveClaim/:itemId/:claimId', VerifyToken, resolveClaim);
router.get('/report/search', VerifyToken, getReportedItemBySearch);
router.get('/', VerifyToken, getReportedItems);
router.get('/rejectClaim/:itemId/:claimId', VerifyToken, rejectClaim);

router.post('/dispute/:id', VerifyToken, disputeRequest);
// router.get('/resolveDispute/:itemId/:disputeId', VerifyToken, resolveDispute);
router.get('/delete/:id', VerifyToken, deleteReportedIemById);

router.post('/comment/:id', VerifyToken, comment);

router.get('/comment/delete/:id/:commentId', VerifyToken, commentDelete);
router.get('/:id', VerifyToken, getItemsById, getReportedItemById);
router.patch('/:id', VerifyToken, updateReportedItem);

export default router;

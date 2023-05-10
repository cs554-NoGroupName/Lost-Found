import express from 'express';
import {
  updateUser,
  updateImage,
  getUser,
  deleteUser,
  myActivity,
} from '../controllers/user.js';
import { VerifyToken } from '../middleware/VerifyToken.js';
import upload from '../utils/uploadImage.js';

const router = express.Router();

router.get('/', VerifyToken, getUser);

router.post('/update', VerifyToken, updateUser);

router.post('/image', VerifyToken, upload.single('imageUrl'), updateImage);

router.get('/delete', VerifyToken, deleteUser);

router.get('/myActivity', VerifyToken, myActivity);
export default router;

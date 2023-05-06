import express from 'express';
import {
  updateUser,
  updateImage,
  getUser,
  deleteUser,
} from '../controllers/user.js';
import { VerifyToken } from '../middleware/VerifyToken.js';
const router = express.Router();

router.get('/', VerifyToken, getUser);

router.post('/update', VerifyToken, updateUser);

router.post('/image', VerifyToken, updateImage);

router.get('/delete', VerifyToken, deleteUser);

export default router;

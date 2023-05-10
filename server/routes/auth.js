import express from 'express';
import { register, getUser, forgot } from '../controllers/auth.js';
import { VerifyToken } from '../middleware/VerifyToken.js';
const router = express.Router();

router.post('/register', register);

router.post('/login', getUser);

router.post('/forgot', forgot);

export default router;

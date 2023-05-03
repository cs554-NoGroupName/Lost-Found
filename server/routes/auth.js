import express from 'express';
import { register, getUser } from '../controllers/auth.js';
import { VerifyToken } from '../middleware/VerifyToken.js';
const router = express.Router();

router.post('/register', register);

router.post('/login', VerifyToken, getUser);

export default router;

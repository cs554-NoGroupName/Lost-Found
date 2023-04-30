import express from 'express';
import { register, getUser } from '../controllers/auth.js';
import { Verify } from '../middleware/VerifyToken.js';
const router = express.Router();

router.post('/register', register);

router.post('/login', Verify, getUser);

export default router;

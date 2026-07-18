import express from'express';  
import {registerUser, verifyOtp, loginUser, changePassword} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router()

router.post('/register',registerUser);
router.post('/verify',verifyOtp);
router.post('/login',loginUser);
router.post('/changePassword', authMiddleware,changePassword);

export default router;
import express from'express';  
import {registerUser, verifyOtp, loginUser} from '../controllers/auth.controller';

const router = express.Router()

router.post('/register',registerUser);
router.post('/verify',verifyOtp);
router.post('/login',loginUser);

export default router;
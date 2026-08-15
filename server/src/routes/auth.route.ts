import express from'express';  
import {registerUser, verifyOtp, loginUser, changePassword, logoutUser, verifylibrarianOrAdminOtp, registerUserLibrarianOrAdmin} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeMiddleware } from '../middleware/authorize.middleware';
import {Roles} from '../constants/roles';
import * as validators from '../validators/auth.validation';
import {validate} from '../middleware/ValidateRequest.middleware'

const router = express.Router()

router.post('/register',validate(validators.registerUserSchema),registerUser);
router.post('/verify',validate(validators.verifyOtpSchema), verifyOtp);
router.post('/login',validate(validators.loginUserSchema),loginUser);
router.post('/logout',authMiddleware,logoutUser);
router.post('/changePassword', authMiddleware,validate(validators.changePasswordSchema),changePassword);
router.post('/registerLib',authMiddleware,authorizeMiddleware(Roles.ADMIN),validate(validators.registerStaffSchema), registerUserLibrarianOrAdmin);
router.post('/verifyLib',authMiddleware,authorizeMiddleware(Roles.ADMIN),validate(validators.verifyStaffOtpSchema),verifylibrarianOrAdminOtp);

export default router;
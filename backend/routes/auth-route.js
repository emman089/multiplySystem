import express from 'express';
import { signup,login,logout, verifyEmail, resetPassword, forgotPassword, checkAuth, checkMember, checkMemberTransaction  } from '../controllers/auth-controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/check-auth', verifyToken, checkAuth)
router.get('/check-member', checkMember)
router.get('/check-transaction', verifyToken, checkMemberTransaction)

export default router;

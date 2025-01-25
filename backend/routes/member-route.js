import express from 'express';
import { createMember } from '../controllers/member-controller.js';
const router = express.Router();

router.post('/create-member', createMember)

export default router;
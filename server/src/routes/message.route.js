import express from 'express';
import { protectroute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages,sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', protectroute, getUsersForSidebar);
router.get('/user/:id', protectroute, getMessages);
router.post('/send/:id',protectroute,sendMessage);

export default router;
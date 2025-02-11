import express from 'express';
import { login, logout, signup ,updateprofile,checkauth} from '../controllers/auth.controller.js';
import { protectroute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);


router.put("/update/profile", protectroute, updateprofile);

router.get("/check", protectroute, checkauth);

export default router;
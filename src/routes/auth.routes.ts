import express from 'express';

import {
  login,
  logout,
  getMe
} from '../controllers/auth.controller';
import protect from '../middlewares/auth.middleware';
import { loginValidator } from '../validations/auth.validator';

const router = express.Router();

router.post('/login', loginValidator, login);
router.post('/logout', protect, logout);

router.get('/getMe', protect, getMe);

export default router;

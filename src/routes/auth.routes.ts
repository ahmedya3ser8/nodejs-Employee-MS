import express from 'express';

import {
  login,
  logout,
  getMe,
  changePassword
} from '../controllers/auth.controller';
import protect from '../middlewares/auth.middleware';
import { changePasswordValidator, loginValidator } from '../validations/auth.validator';

const router = express.Router();

router.post('/login', loginValidator, login);
router.post('/logout', logout);

router.get('/getMe', protect, getMe);

router.patch('/changePassword', protect, changePasswordValidator, changePassword);

export default router;

import express from 'express';

import { 
  changePassword,
  getProfile, 
  updateProfile 
} from '../controllers/user.controller';
import protect from '../middlewares/auth.middleware';
import { changePasswordValidator, updateMeValidator } from '../validations/user.validator';

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .patch(updateMeValidator, updateProfile)

router.patch('/change-password', changePasswordValidator, changePassword);

export default router;

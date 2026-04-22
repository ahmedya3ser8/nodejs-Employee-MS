import express from 'express';

import {
  getProfile,
  updateProfile
} from '../controllers/profile.controller';
import protect from '../middlewares/auth.middleware';
import { updateMeValidator } from '../validations/profile.validator'; 

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProfile)
  .patch(updateMeValidator, updateProfile)

export default router;

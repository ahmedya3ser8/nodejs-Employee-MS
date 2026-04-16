import { body } from "express-validator";
import bcrypt from 'bcryptjs';

import validate from "../middlewares/validate.middleware";
import User from "../models/user.model";
import ApiError from "../utils/apiError";

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .custom(async (value, { req }) => {
      const user = await User.findById(req.user?._id);
      if (!user) throw new ApiError('User not found', 404);

      const isMatched = await bcrypt.compare(value, user.password);
      if (!isMatched) throw new ApiError('Current password is incorrect', 400);

      return true;
    }),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required'),
  validate
];

export const updateMeValidator = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('FirstName must be between 2 and 30 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('LastName must be between 2 and 30 characters'),
  body('position')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  validate
];

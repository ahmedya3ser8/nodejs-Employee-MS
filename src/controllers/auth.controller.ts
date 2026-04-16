import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";

import { cookieConfig } from "../config/cookie";
import catchAsync from "../middlewares/catchAsync.middleware";
import User from "../models/user.model";
import ApiError from "../utils/apiError";
import generateToken from "../utils/generateToken";
import { AuthRequest } from '../middlewares/auth.middleware';

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError('Invalid email or password', 400));

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) return next(new ApiError('Invalid email or password', 400));

  generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  }, res);

  res.status(201).json({
    success: true,
    message: 'User login successfully',
    data: {
      userId: user._id,
      email: user.email,
      role: user.role
    }
  })
});

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private/Protect
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('ems_access_token', cookieConfig);
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
    data: null
  })
});

// @desc    Get User Data
// @route   GET /api/auth/getMe
// @access  Private/Protect
export const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user?._id);
  if (!user) return next(new ApiError('User not found', 404));

  res.status(200).json({ 
    success: true, 
    message: 'User retrieved successfully',
    data: {
      userId: user._id,
      email: user.email,
      role: user.role
    }
  });
});
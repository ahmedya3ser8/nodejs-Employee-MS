import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";

import User from "../models/user.model";
import Employee from '../models/employee.model';

import catchAsync from "../middlewares/catchAsync.middleware";
import { AuthRequest } from '../middlewares/auth.middleware';

import { cookieConfig } from "../config/cookie";
import ApiError from "../utils/apiError";
import generateToken from "../utils/generateToken";

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError('Invalid email or password', 400));

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) return next(new ApiError('Invalid email or password', 400));

  const employee = await Employee.findOne({ user: user._id }).populate({
    path: 'user',
    select: '-password -passwordChangedAt'
  })
  if (!employee) return next(new ApiError('Employee not found', 404));

  generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  }, res);

  res.status(201).json({
    success: true,
    message: 'User login successfully',
    data: employee
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
  const employee = await Employee.findOne({ user: req.user?._id }).populate({
    path: 'user',
    select: '-password -passwordChangedAt'
  })
  if (!employee) return next(new ApiError('Employee not found', 404));

  res.status(200).json({ 
    success: true, 
    message: 'User retrieved successfully',
    data: employee
  });
});

// @desc    Change User Password
// @route   PATCH /api/auth/changePassword
// @access  Private/Protect
export const changePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const employee = await Employee.findOne({ user: req.user?._id }).populate({
    path: 'user',
    select: '-password -passwordChangedAt'
  })
  if (!employee) return next(new ApiError('Employee not found', 404));

  const user = await User.findById(employee.user);
  if (!user) return next(new ApiError("User not found", 404));

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  user.passwordChangedAt = new Date();

  await user.save();

  generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  }, res);

  res.status(200).json({
    success: true, 
    message: 'Password changed successfully',
    data: employee
  })
});

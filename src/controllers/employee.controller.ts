import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs';

import User from "../models/user.model";
import Employee from "../models/employee.model";

import ApiError from "../utils/apiError";
import catchAsync from "../middlewares/catchAsync.middleware";

// @desc    Get All Employees
// @route   GET /api/employees
// @access  Private/Admin
export const getEmployees = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const employees = await Employee.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json({ 
    success: true, 
    message: 'Employees retrieved successfully',
    data: employees
  });
});

// @desc    Get Specific Employee
// @route   GET /api/employees/:id
// @access  Private/Admin
export const getEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return next(new ApiError('Employee not found', 404));

  res.status(200).json({ 
    success: true, 
    message: 'Employee retrieved successfully',
    data: employee
  });
});

// @desc    Create Employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, phoneNumber, bio, department, position, basicSalary, allowances, deductions, email, password, role } = req.body;

  // 1) check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ApiError('User already exists', 400));

  const hashedPassword = await bcrypt.hash(password, 10);

  // 2) create new user
  const user = await User.create({
    email,
    password: hashedPassword,
    role
  });

  // 3) create new employee
  const employee = await Employee.create({
    firstName,
    lastName,
    phoneNumber,
    bio,
    department,
    position,
    basicSalary,
    allowances,
    deductions,
    user: user._id
  });

  const result = await Employee.findById(employee._id).populate({
    path: 'user',
    select: '-password'
  });

  res.status(201).json({ 
    success: true, 
    message: 'Employee Created successfully',
    data: result
  });
});

// @desc    Update Specific Employee
// @route   PATCH /api/employees/:id
// @access  Private/Admin
export const updateEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;

  const employee = await Employee.findById(req.params.id).populate({
    path: 'user',
    select: '-password'
  });
  if (!employee) return next(new ApiError('Employee not found', 404));

  Object.assign(employee, req.body);

  const user = await User.findById(employee.user);
  if (!user) return next(new ApiError('User not found', 400));

  if (email) user.email = email;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }
  if (role) user.role = role;

  await employee.save();
  await user.save();

  res.status(200).json({
    success: true, 
    message: "Employee updated successfully",
    data: employee
  });
});

// @desc    Delete Specific Employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return next(new ApiError('Employee not found', 404));

  employee.isActive = false;
  await employee.save();

  const user = await User.findById(employee.user);
  if (user) {
    user.isActive = false;
    await user.save();
  }

  res.status(200).json({
    success: true, 
    message: "Employee deactivated successfully",
    data: null
  });
});

// Object.assign(employee, req.body);
// await employee.save();
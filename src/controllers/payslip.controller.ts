import { NextFunction, Request, Response } from "express";

import Payslip from "../models/payslip.model";
import Employee from "../models/employee.model";

import catchAsync from "../middlewares/catchAsync.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";

import ApiError from "../utils/apiError";

// @desc    Create Payslip
// @route   POST /api/payslips
// @access  Private/Admin
export const createPayslip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { month, year, basicSalary, allowances, deductions, employee } = req.body;

  const netSalary = basicSalary + allowances - deductions;

  const payslip = await Payslip.create({
    month,
    year,
    basicSalary,
    allowances,
    deductions,
    netSalary,
    employee
  });

  res.status(201).json({ 
    success: true, 
    message: 'Payslip Created successfully',
    data: payslip
  });
});

// @desc    Get All Payslips
// @route   GET /api/payslips
// @access  Private/Admin
export const getPayslips = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payslips = await Payslip.find().populate({
    path: 'employee'
  });

  res.status(200).json({ 
    success: true, 
    message: 'Payslips retrieved successfully',
    data: payslips
  });
});

// @desc    Get Specific Payslip
// @route   GET /api/payslips/:id
// @access  Private/Protect
export const getPayslip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payslip = await Payslip.findById(req.params.id).populate({
    path: 'employee',
    populate: {
      path: 'user',
      select: '-password'
    }
  });
  if (!payslip) return next(new ApiError('Payslip not found', 404));

  res.status(200).json({ 
    success: true, 
    message: 'Payslip retrieved successfully',
    data: payslip
  });
});

// @desc    Get All Payslips for Specific Employee
// @route   GET /api/payslips/me
// @access  Private/Protect
export const getMyPayslips = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const employee = await Employee.findOne({ user: req.user?._id });
  if (!employee) return next(new ApiError('Employee not found', 404));

  const payslips = await Payslip.find({ employee: employee._id });

  res.status(200).json({ 
    success: true, 
    message: 'Payslips retrieved successfully',
    data: payslips
  });
});

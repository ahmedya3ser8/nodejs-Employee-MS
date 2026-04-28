import { NextFunction, Request, Response } from "express";

import { AuthRequest } from "../middlewares/auth.middleware";
import catchAsync from "../middlewares/catchAsync.middleware";

import Employee from "../models/employee.model";
import Attendance from "../models/attendance.model";
import Leave from "../models/leave.model";
import Payslip from "../models/payslip.model";

import { DEPARTMENTS } from "../constants/department";
import ApiError from "../utils/apiError";

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/admin
// @access  Private/Protect
export const getAdminDashboard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const totalEmployees = await Employee.countDocuments();

  const totalDepartment = DEPARTMENTS.length;

  const todaysAttendance = await Attendance.countDocuments({
    date: { $gte: today, $lt: tomorrow },
    status: { $in: ['present', 'late'] }
  });

  const pendingLeaves = await Leave.countDocuments({
    status: 'pending'
  })

  res.status(200).json({
    status: true,
    data: {
      totalEmployees,
      totalDepartment,
      todaysAttendance,
      pendingLeaves
    }
  })
})

// @desc    Get Employee Dashboard Stats
// @route   GET /api/dashboard/employee
// @access  Private/Protect
export const getEmployeeDashboard = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const employee = await Employee.findOne({ user: req.user?._id });
  if (!employee) return next(new ApiError('Employee not found', 404));

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const attendances = await Attendance.find({
    employee: employee._id,
    date: { $gte: startOfMonth, $lte: now }
  });

  const daysPresent = attendances.filter((a) => a.status === "present" || a.status === "late").length;

  const pendingLeaves = await Leave.countDocuments({
    employee: employee._id,
    status: 'pending'
  })

  const latestPayslip = await Payslip.findOne({ employee: employee._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: true,
    data: {
      daysPresent,
      pendingLeaves,
      latestPayslip: latestPayslip?.netSalary || 0
    }
  })
})

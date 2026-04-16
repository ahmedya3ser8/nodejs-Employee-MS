import mongoose, { Document, Schema, Types } from "mongoose";

import { DEPARTMENTS, Department } from "../constants/department";

interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  joinDate: Date;
  bio: string;
  department: Department;
  position: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  isActive: boolean;
  user: Types.ObjectId,
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema: Schema<IEmployee> = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    phoneNumber: { 
      type: String, 
      required: true 
    },
    joinDate: { 
      type: Date, 
      default: Date.now
    },
    bio: { 
      type: String,
      default: null
    },
    department: {
      type: String,
      enum: DEPARTMENTS,
      required: true
    },
    position: { 
      type: String, 
      required: true 
    },
    basicSalary: { 
      type: Number,
      required: true,
      default: 0
    },
    allowances: { 
      type: Number,
      default: 0 
    },
    deductions: { 
      type: Number,
      default: 0 
    },
    isActive: {
      type: Boolean,
      default: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;

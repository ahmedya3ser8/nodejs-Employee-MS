import mongoose, { Schema, Types } from "mongoose";

export interface IPayslip extends Document {
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  employee: Types.ObjectId;
}

const payslipSchema: Schema<IPayslip> = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    basicSalary: {
      type: Number,
      required: true
    },
    allowances: {
      type: Number,
      default: 0
    },
    deductions: {
      type: Number,
      default: 0
    },
    netSalary: {
      type: Number,
      required: true
    },
    employee: {
      type: mongoose.Types.ObjectId,
      ref: 'Employee',
      required: true
    }
  },
  { timestamps: true }
);

const Payslip = mongoose.model<IPayslip>('Payslip', payslipSchema);

export default Payslip;

import mongoose, { Schema, Types } from "mongoose";

export interface ILeave extends Document {
  type: 'sick' | 'casual' | 'annual';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  employee: Types.ObjectId;
}

const leaveSchema: Schema<ILeave> = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['sick', 'casual', 'annual'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    employee: {
      type: mongoose.Types.ObjectId,
      ref: 'Employee',
      required: true
    }
  },
  { timestamps: true }
);

const Leave = mongoose.model<ILeave>('Leave', leaveSchema);

export default Leave;

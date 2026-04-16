import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'employee';
  passwordChangedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee'
    },
    passwordChangedAt: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;

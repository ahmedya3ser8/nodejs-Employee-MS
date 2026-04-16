import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import catchAsync from "./catchAsync.middleware";
import ApiError from "../utils/apiError";
import User, { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: IUser;
}

const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.ems_access_token;
  if (!token) return next(new ApiError('Not authorized, please login', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await User.findById(decoded.userId);
  if (!user) return next(new ApiError('The user belonging to this token no longer exists', 401));

  if (user.passwordChangedAt) {
    const passwordChangeTime = user.passwordChangedAt.getTime() / 1000;
    if (passwordChangeTime > decoded.iat!) return next(new ApiError('Password was changed recently. Please login again', 401));
  }

  req.user = user;
  next();
});

export default protect;

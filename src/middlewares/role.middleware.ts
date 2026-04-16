import { NextFunction, Request, Response } from "express";

import ApiError from "../utils/apiError";
import { AuthRequest } from "./auth.middleware";

type Role = "admin" | "employee";

const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError("Not authenticated", 401));

    if (!roles.includes(req.user.role)) {
      return next(new ApiError("You do not have permission to perform this action", 403));
    }

    next();
  }
}

export default authorizeRoles;

import type { NextFunction, Request, Response } from "express";
import type { UserDocument } from "models/user.model.ts";
import { AppError } from "utils/AppError.ts";

export const restrictTo = (...roles: string[]) => {
  return (
    req: Request & { user?: UserDocument },
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Invalid token", 401);
    }
    if (!roles.includes(req.user?.role as string)) {
      throw new AppError("You are not authorized to access this resource", 403);
    }
    next();
  };
};

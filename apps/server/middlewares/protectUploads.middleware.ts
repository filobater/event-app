import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "models/user.model.ts";
import { AppError } from "utils/AppError.ts";

export const protectUploads = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new AppError("Token not found", 401);
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const userId = (payload as JwtPayload).id;
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

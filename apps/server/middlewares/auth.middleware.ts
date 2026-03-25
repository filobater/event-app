// protect middleware to check if the user is authenticated
// get the access token from the header if it exist we will do the following: 1- decoded to know if there is user or not
// then check if this user changed the password after the iat if not we continue else we throw error

import { AppError } from "utils/AppError.ts";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type UserDocument } from "models/user.model.ts";
import type { NextFunction, Request, Response } from "express";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError("Token not found", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById((decoded as JwtPayload).id);
    if (!user) {
      throw new AppError("Invalid token", 401);
    }
    if (user.isPasswordChangedAfter((decoded as JwtPayload).iat ?? 0)) {
      throw new AppError("Password changed, please login again", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

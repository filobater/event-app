import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "utils/sendResponse.ts";
import { AppError } from "utils/AppError.ts";

export const uploadController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!res.locals.uploadedFiles) {
    next(new AppError("No file uploaded", 400));
    return;
  }
  sendResponse({
    res,
    statusCode: 200,
    message: "Files uploaded successfully",
    data: res.locals.uploadedFiles,
  });
};

import type { Request, Response, NextFunction } from "express";
import { upload } from "middlewares/upload/upload.middleware.ts";
import { compressImage } from "middlewares/upload/compress.middleware.ts";
import { compressImages } from "middlewares/upload/compress.middleware.ts";
import { AppError } from "utils/AppError.ts";

export const handleSingleUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single("file")(req, res, (err) => {
    if (err) return next(new AppError("Failed to upload file", 500));
    compressImage(res.locals.uploadSpec)(req, res, next);
  });
};

export const handleMultipleUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.array("files", 20)(req, res, (err) => {
    if (err) return next(new AppError("Failed to upload files", 500));
    compressImages(res.locals.uploadSpec)(req, res, next);
  });
};

import type { Request, Response, NextFunction } from "express";
import { UPLOAD_SPECS } from "config/upload.config.ts";
import { AppError } from "utils/AppError.ts";
import type { UploadKind } from "@events-app/shared-dtos";

export const resolveUploadSpec = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const spec = UPLOAD_SPECS[req.query.type as UploadKind];
  if (!spec) {
    next(new AppError(`Unknown upload type: "${req.query.type}"`, 400));
    return;
  }
  res.locals.uploadSpec = spec;
  next();
};

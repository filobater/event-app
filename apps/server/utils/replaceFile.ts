import fs from "fs";
import type { Request } from "express";
import { AppError } from "utils/AppError.ts";

export const replaceFile = (
  oldPath?: string | null,
  req?: Request,
  field?: string,
): string | undefined => {
  const newPath: string | undefined =
    req && field ? req.body[field] : undefined;

  if (oldPath && (!req || newPath)) {
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, (err) => {
        if (err) throw new AppError("Failed to delete file", 500);
      });
    }
  }
  return newPath;
};

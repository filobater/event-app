import sharp from "sharp";
import path from "path";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import type { UploadSpec } from "config/upload.config.ts";
import { AppError } from "utils/AppError.ts";

const BASE_UPLOAD_DIR = "uploads";

const processImage = async (
  buffer: Buffer,
  spec: UploadSpec,
): Promise<string> => {
  const dir = path.join(BASE_UPLOAD_DIR, spec.prefix);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filename = `${spec.prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const filepath = path.join(dir, filename);

  await sharp(buffer)
    .resize(spec.width, spec.height, { fit: "cover", position: "center" })
    .webp({ quality: 80 })
    .toFile(filepath);

  return filepath;
};

// For /upload/single
export const compressImage =
  (spec: UploadSpec) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) return next();
      res.locals.uploadedFiles = { url: await processImage(file.buffer, spec) };
      next();
    } catch (err) {
      next(new AppError("Failed to compress image", 500));
    }
  };

// For /upload/multiple
export const compressImages =
  (spec: UploadSpec) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files?.length) return next();
      res.locals.uploadedFiles = {
        urls: await Promise.all(files.map((f) => processImage(f.buffer, spec))),
      };
      next();
    } catch (err) {
      next(new AppError("Failed to compress images", 500));
    }
  };

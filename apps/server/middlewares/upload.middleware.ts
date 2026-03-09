import multer from "multer";
import sharp from "sharp"
import path from 'path'
import fs from 'fs'
import type { Request, Response, NextFunction } from "express";
import { AppError } from "utils/AppError.ts";
import type { FileFilterCallback } from "multer";

const uploadDir = 'uploads'
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

//memoryStorage so Sharp can intercept and compress BEFORE saving.

const storage = multer.memoryStorage();

 const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {  
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new AppError("Only image files are allowed (jpeg, png, webp, gif)", 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});

export const compressAndSave = (prefix: string, width: number, height: number) => async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next(); // no file uploaded, skip

  const filename = `${prefix}-${Date.now()}.webp`; 
  const filepath = path.join(uploadDir, filename);

  try {
    await sharp(req.file.buffer)
      .resize(width, height, {
        fit: "cover", 
        position: "center",
      })
      .webp({ quality: 80 }) 
      .toFile(filepath);

    req.file.path = filepath;
    next();
  } catch (err) {
    next(err);
  }
};

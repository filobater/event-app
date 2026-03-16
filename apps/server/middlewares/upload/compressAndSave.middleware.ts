import sharp from "sharp";
import path from "path";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "utils/AppError.ts";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export type CommonFieldConfig = {
  fieldName: string;
  bodyKey: string;
  prefix: string;
  width: number;
  height: number;
};

export type SingleFieldConfig = CommonFieldConfig & {
  type: "single";
};

export type ArrayFieldConfig = CommonFieldConfig & {
  type: "array";
  imageKey: string;
  maxCount?: number;
};

export type FieldConfig = SingleFieldConfig | ArrayFieldConfig;

const processImage = async (
  buffer: Buffer,
  prefix: string,
  width: number,
  height: number,
): Promise<string> => {
  // TODO: add user id to the filename and edit the path based on the prefix
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const filepath = path.join(uploadDir, filename);

  await sharp(buffer)
    .resize(width, height, { fit: "cover", position: "center" })
    .webp({ quality: 80 })
    .toFile(filepath);

  return filepath;
};

export const compressAndSave =
  (fields: FieldConfig[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as
        | Record<string, Express.Multer.File[]>
        | undefined;

      for (const field of fields) {
        if (field.type === "single") {
          const file =
            files?.[field.fieldName]?.[0] ??
            (req.file?.fieldname === field.fieldName ? req.file : undefined);

          if (file) {
            req.body[field.bodyKey] = await processImage(
              file.buffer,
              field.prefix,
              field.width,
              field.height,
            );
          } else {
            req.body[field.bodyKey] = null;
          }
        }

        if (field.type === "array") {
          const uploadedFiles = files?.[field.fieldName] ?? [];

          if (typeof req.body[field.bodyKey] === "string") {
            try {
              req.body[field.bodyKey] = JSON.parse(req.body[field.bodyKey]);
            } catch {
              return next(
                new AppError(`Invalid JSON for field "${field.bodyKey}"`, 400),
              );
            }
          }

          if (uploadedFiles.length > 0) {
            const items: Record<string, unknown>[] =
              req.body[field.bodyKey] ?? [];

            const paths = await Promise.all(
              uploadedFiles.map((file, i) =>
                processImage(
                  file.buffer,
                  `${field.prefix}-${i}`,
                  field.width,
                  field.height,
                ),
              ),
            );

            paths.forEach((filepath, i) => {
              if (items[i]) items[i][field.imageKey] = filepath;
            });

            req.body[field.bodyKey] = items;
          }
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };

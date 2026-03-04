import { type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

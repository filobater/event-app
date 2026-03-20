import type { NextFunction, Request, Response } from "express";
import { AppError } from "utils/AppError.ts";

export const checkId =
  <TDoc>(
    Model: { findById: (id: string) => Promise<TDoc | null> },
    key: "targetUser" | "event" | "registration",
  ) =>
  async (req: Request, _res: Response, next: NextFunction, value: string) => {
    const doc = await Model.findById(value);

    if (!doc) {
      return next(new AppError("Resource not found", 404));
    }

    req[key] = doc;

    next();
  };

import { ZodError } from "zod";
import { AppError } from "../utils/AppError.ts";
import type { Request, Response, NextFunction } from "express";

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const duplicateField = Object.keys(err.keyValue)[0];
  const message = `${duplicateField} already exists in the database`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleExpiredTokenError = () => {
  return new AppError("Token expired. Please login again", 401);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please login again", 401);
};

const handleZodError = (err: ZodError, res: Response): void => {
  const errors = err.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const field = issue.path.join(".") || "_root";
    if (!acc[field]) acc[field] = [];
    acc[field].push(issue.message);
    return acc;
  }, {});

  res.status(400).json({ status: "fail", errors });
};

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("ERROR 💥💥💥");

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, name: err.name, message: err.message };
    if (error?.name === "CastError") {
      error = handleCastErrorDB(error);
    }

    if (error?.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error?.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (err instanceof ZodError) {
      return handleZodError(err, res);
    }
    if (error?.name === "TokenExpiredError") {
      error = handleExpiredTokenError();
    }
    if (error?.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    sendErrorProd(error, res);
  }
};

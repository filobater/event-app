import type { Response } from "express";

interface SendResponseOptions<T> {
  res: Response;
  statusCode: number;
  message?: string;
  data?: T;
  token?: string;
}

export const sendResponse = <T>({
  res,
  statusCode,
  message,
  data,
  token,
}: SendResponseOptions<T>): void => {
  const body: Record<string, unknown> = { status: "success" };

  if (message) body["message"] = message;
  if (token) body["token"] = token;
  if (data) body["data"] = data;

  res.status(statusCode).json(body);
};

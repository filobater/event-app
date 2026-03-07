import jwt, { type SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

const ACCESS_TOKEN_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ??
  "15m") as SignOptions["expiresIn"];

const REFRESH_TOKEN_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ??
  "7d") as SignOptions["expiresIn"];

export const generateAccessToken = (id: string): string => {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

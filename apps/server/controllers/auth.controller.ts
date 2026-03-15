import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { User, type UserDocument } from "../models/user.model.ts";
import { AppError } from "../utils/AppError.ts";
import { sendOTPEmail } from "../utils/sendOTPEmail.ts";
import sendEmail from "utils/sendEmail.ts";
import { sendResponse } from "../utils/sendResponse.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "utils/generateToken.ts";
import jwt, { type JwtPayload } from "jsonwebtoken";

const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  });
};

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  return { otp, hashedOtp };
};

export const signup = async (req: Request, res: Response) => {
  const { body } = req;

  const { otp, hashedOtp } = generateOTP();
  const createdUser = await User.create({
    ...body,
    role: "user",
    otp: hashedOtp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  }); // 10 minutes

  await sendOTPEmail(createdUser.email, otp);
  sendResponse({
    res,
    statusCode: 201,
    message:
      "User created successfully, please check your email to verify your account",
  });
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    email,
    otp: hashedOtp,
    otpExpiresAt: { $gte: Date.now() },
  }).select("+otp +otpExpiresAt");
  if (!user) {
    throw new AppError("The otp is incorrect or expired", 400);
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  sendRefreshToken(res, refreshToken);
  sendResponse({
    res,
    statusCode: 200,
    message: "OTP verified successfully",
    data: { user, token: accessToken },
  });
};

export const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("No account found with this email", 404);
  }
  if (user.isVerified) {
    throw new AppError("This account is already verified", 400);
  }

  const { otp, hashedOtp } = generateOTP();
  user.otp = hashedOtp;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendOTPEmail(user.email, otp);
  sendResponse({
    res,
    statusCode: 200,
    message: "A new OTP has been sent to your email",
  });
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Incorrect email or password", 400);
  }
  if (!user.isVerified) {
    throw new AppError("Please verify your account first", 400);
  }
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  sendRefreshToken(res, refreshToken);
  sendResponse({
    res,
    message: "Signed in successfully",
    statusCode: 200,
    data: { user, token: accessToken },
  });
};

// get the email from the body t
// check for the user if found generate the token, then send email else not found
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("No account found with this email", 404);
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/auth/reset-password?resetToken=${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message: `Click the link to reset your password in Eventify: ${resetPasswordUrl}`,
    });
  } catch {
    user.passwordResetExpiresAt = null;
    user.passwordResetToken = null;
    await user.save({ validateBeforeSave: false });
    throw new AppError("Failed to send password reset email", 500);
  }

  sendResponse({
    res,
    statusCode: 200,
    message: "Password reset email sent",
  });
};

// get the token from the params, then hashit with crypto, find the user with passwordResetToken and passwordResetExpiresAt
// if not found return 400 token is invalid or expired, else update this.password = password provided then save the user, send status 200 with the token

export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  if (!resetToken) {
    throw new AppError("Token not found", 404);
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken as string)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gte: Date.now() },
  });
  if (!user) {
    throw new AppError("Token invalid or expired", 400);
  }

  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpiresAt = null;
  await user.save();

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  sendRefreshToken(res, refreshToken);
  sendResponse({
    res,
    statusCode: 200,
    message: "Password reset successfully",
    data: { user, token: accessToken },
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new AppError("Refresh token not found", 404);
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

    const newAccessToken = generateAccessToken((payload as JwtPayload).id);
    const newRefreshToken = generateRefreshToken((payload as JwtPayload).id);

    sendRefreshToken(res, newRefreshToken);

    sendResponse({
      res,
      statusCode: 200,
      data: { token: newAccessToken },
    });
  } catch {
    res.clearCookie("refreshToken");
    throw new AppError("Refresh token invalid or expired", 401);
  }
};

export const signout = (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  sendResponse({
    res,
    statusCode: 200,
    message: "Signed out successfully",
  });
};

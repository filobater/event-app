import type { BaseResponseDto } from "./base.dto.js";
// ─── Shared User shape returned in responses ────────────────────────────────

export type UserDto = {
  _id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: "admin" | "user";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  balance: number;
};

// ─── Shared base types ───────────────────────────────────────────────────────

export type EmailDto = {
  email: string;
};

export type AuthResponseDto = BaseResponseDto & {
  data: { user: UserDto; token: string };
};

// ─── Requests ────────────────────────────────────────────────────────────────

export type SignupRequestDto = EmailDto & {
  fullName: string;
  password: string;
  confirmPassword: string;
};

export type SigninRequestDto = EmailDto & {
  password: string;
};

export type VerifyOtpRequestDto = EmailDto & {
  otp: string;
};

export type ResendOtpRequestDto = EmailDto;

export type ForgotPasswordRequestDto = EmailDto;

export type ResetPasswordRequestDto = {
  password: string;
  confirmPassword: string;
};

// ─── Responses ───────────────────────────────────────────────────────────────

export type SignupResponseDto = BaseResponseDto;

export type SigninResponseDto = AuthResponseDto;

export type VerifyOtpResponseDto = AuthResponseDto;

export type ResendOtpResponseDto = BaseResponseDto;

export type ForgotPasswordResponseDto = BaseResponseDto;

export type ResetPasswordResponseDto = AuthResponseDto;

export type RefreshTokenResponseDto = AuthResponseDto;

export type SignoutResponseDto = BaseResponseDto;

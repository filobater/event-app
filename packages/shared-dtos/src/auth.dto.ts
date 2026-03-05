// ─── Shared User shape returned in responses ────────────────────────────────

export interface UserDto {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Requests ────────────────────────────────────────────────────────────────

export interface SignupRequestDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SigninRequestDto {
  email: string;
  password: string;
}

export interface VerifyOtpRequestDto {
  email: string;
  otp: string;
}

export interface ResendOtpRequestDto {
  email: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  password: string;
  confirmPassword: string;
}

// ─── Responses ───────────────────────────────────────────────────────────────

export interface SignupResponseDto {
  status: string;
  message: string;
}

export interface SigninResponseDto {
  status: string;
  token: string;
  data: { user: UserDto };
}

export interface VerifyOtpResponseDto {
  status: string;
  message: string;
  token: string;
  data: { user: UserDto };
}

export interface ResendOtpResponseDto {
  status: string;
  message: string;
}

export interface ForgotPasswordResponseDto {
  status: string;
  message: string;
}

export interface ResetPasswordResponseDto {
  status: string;
  message: string;
  token: string;
  data: { user: UserDto };
}

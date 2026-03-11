// ─── Shared User shape returned in responses ────────────────────────────────

export interface UserDto {
  _id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: "admin" | "user";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Shared base types ───────────────────────────────────────────────────────

export interface EmailDto {
  email: string;
}

export interface BaseResponseDto {
  status: string;
  message: string;
}

export interface AuthResponseDto extends BaseResponseDto {
  data: { user: UserDto; token: string };
}

// ─── Requests ────────────────────────────────────────────────────────────────

export interface SignupRequestDto extends EmailDto {
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface SigninRequestDto extends EmailDto {
  password: string;
}

export interface VerifyOtpRequestDto extends EmailDto {
  otp: string;
}

export type ResendOtpRequestDto = EmailDto;

export type ForgotPasswordRequestDto = EmailDto;

export interface ResetPasswordRequestDto {
  password: string;
  confirmPassword: string;
}

// ─── Responses ───────────────────────────────────────────────────────────────

export type SignupResponseDto = BaseResponseDto;

export interface SigninResponseDto extends Omit<AuthResponseDto, "message"> {}

export interface VerifyOtpResponseDto extends AuthResponseDto {}

export type ResendOtpResponseDto = BaseResponseDto;

export type ForgotPasswordResponseDto = BaseResponseDto;

export interface ResetPasswordResponseDto extends AuthResponseDto {}

export interface RefreshTokenResponseDto extends Omit<
  AuthResponseDto,
  "message"
> {}

export type SignoutResponseDto = BaseResponseDto;

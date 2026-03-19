import type { SignupRequestDto, UserDto } from "./auth.dto.js";
import type { PaginatedResponseDto } from "./paginated.dto.js";
import type { BaseResponseDto } from "./base.dto.js";

// ─── Requests ────────────────────────────────────────────────────────────────

export type CreateUserRequestDto = SignupRequestDto & {
  role?: "admin" | "user";
};

export type UpdateUserRequestDto = SignupRequestDto;

export type UpdateUserProfileRequestDto = Partial<SignupRequestDto>;

export type UpdateUserPasswordRequestDto = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// ─── Responses ───────────────────────────────────────────────────────────────

export type UserResponseDto = BaseResponseDto & {
  data: { user: UserDto };
};

export type GetAllUsersResponseDto = PaginatedResponseDto<{ users: UserDto[] }>;

export type UpdateUserResponseDto = UserResponseDto;

export type UpdateUserProfileResponseDto = UserResponseDto;

export type UpdateUserPasswordResponseDto = UserResponseDto;

export type DeleteUserResponseDto = BaseResponseDto;

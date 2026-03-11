import type {
  BaseResponseDto,
  ResetPasswordRequestDto,
  SignupRequestDto,
  UserDto,
} from "./auth.dto.js";

// ─── Paginated wrapper ────────────────────────────────────────────────────────

export interface PaginatedResponseDto<T> extends BaseResponseDto {
  data: {
    users: T[];
    count: number;
    totalData: number;
    totalPages: number;
    page: number;
  };
}

export interface UserResponseDto extends BaseResponseDto {
  data: UserDto;
}

// ─── Requests ────────────────────────────────────────────────────────────────

export interface CreateUserRequestDto extends SignupRequestDto {
  role: "admin" | "user";
}

export interface UpdateUserRequestDto extends SignupRequestDto {}

export interface UpdateUserProfileRequestDto extends Partial<SignupRequestDto> {}

export interface UpdateUserPasswordRequestDto extends ResetPasswordRequestDto {}

// ─── Responses ───────────────────────────────────────────────────────────────

export type GetAllUsersResponseDto = PaginatedResponseDto<UserDto>;

export interface UpdateUserResponseDto extends UserResponseDto {}

export interface UpdateUserProfileResponseDto extends UserResponseDto {}

export interface UpdateUserPasswordResponseDto extends UserResponseDto {}

export type DeleteUserResponseDto = BaseResponseDto;

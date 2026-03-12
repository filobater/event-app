import type { BaseResponseDto } from "./base.dto.js";

export type PaginatedResponseDto<T> = BaseResponseDto & {
  data: T & {
    count: number;
    totalData: number;
    totalPages: number;
    page: number;
  };
};

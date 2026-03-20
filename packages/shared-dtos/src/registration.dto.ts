import type { BaseResponseDto } from "./base.dto.js";
import type { UserDto } from "./auth.dto.js";
import type { EventDto } from "./event.dto.js";

// ─── Entity

export type RegistrationDto = {
  _id: string;
  user: string | UserDto;
  event: string | EventDto;
  status: "reserved" | "confirmed" | "cancelled";
  expiresAt: string | null;
  seatsCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

// ─── Requests

export type CreateRegistrationRequestDto = {
  event: string;
  seatsCount: number;
};

// ─── Responses

export type CreateRegistrationResponseDto = BaseResponseDto & {
  data: { registration: RegistrationDto };
};

export type PayRegistrationResponseDto = BaseResponseDto & {
  data: { registration: RegistrationDto };
};

export type CancelRegistrationResponseDto = BaseResponseDto;

export type GetAllRegistrationsResponseDto = BaseResponseDto & {
  data: { registrations: RegistrationDto[] };
};

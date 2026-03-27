import type { BaseResponseDto } from "./base.dto.js";
import type { PaginatedResponseDto } from "./paginated.dto.js";
import { RegistrationDto } from "./registration.dto.js";

export type SpeakerDto = {
  name: string;
  title: string;
  image: string | File;
};

export type EventDto = {
  _id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  endTime: string;
  totalSeats: number;
  registeredSeats: number;
  status: "ongoing" | "upcoming" | "completed";
  photo: string;
  speakers: SpeakerDto[];
  price: number;
  type: "free" | "paid";
  registration: RegistrationDto["_id"];
  isPaid: boolean;
  category: "technology" | "business" | "design" | "marketing";
  createdAt: string;
  updatedAt: string;
};

// Requests

export type CreateEventRequestDto = Omit<
  EventDto,
  "_id" | "createdAt" | "updatedAt" | "registeredSeats"
>;

export type UpdateEventRequestDto = Partial<CreateEventRequestDto> & {
  _id?: string;
};

// Responses

export type EventResponseDto = BaseResponseDto & {
  data: { event: EventDto };
};

export type GetAllEventsResponseDto = PaginatedResponseDto<{
  events: EventDto[];
}>;

export type UpdateEventResponseDto = EventResponseDto;

export type DeleteEventResponseDto = BaseResponseDto;

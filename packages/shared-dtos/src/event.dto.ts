import type { BaseResponseDto } from "./base.dto.js";
import type { PaginatedResponseDto } from "./paginated.dto.js";

export type SpeakerDto = {
  name: string;
  title: string;
  image: string;
};

export type EventDto = {
  _id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  totalSeats: number;
  registeredSeats: number;
  status: "ongoing" | "upcoming" | "completed";
  photo: string;
  speakers: SpeakerDto[];
  price: number;
  category: "technology" | "business" | "design" | "marketing";
  createdAt: string;
  updatedAt: string;
};

// Requests

export type CreateEventRequestDto = Omit<
  EventDto,
  "_id" | "createdAt" | "updatedAt" | "registeredSeats"
> & {
  speakers: string;
  speakerImages: string[];
};

export type UpdateEventRequestDto = Partial<CreateEventRequestDto>;

// Responses

export type EventResponseDto = BaseResponseDto & {
  data: { event: EventDto };
};

export type GetAllEventsResponseDto = PaginatedResponseDto<{
  events: EventDto[];
}>;

export type UpdateEventResponseDto = EventResponseDto;

export type DeleteEventResponseDto = BaseResponseDto;

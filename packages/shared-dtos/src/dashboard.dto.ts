import type { BaseResponseDto } from "./base.dto.js";
import type { EventDto } from "./event.dto.js";

export type CountDto = {
  _id: string;
  count: number;
};

export type DashboardStatsResponseDto = BaseResponseDto & {
  data: {
    totalEvents: number;
    totalUsers: number;
    totalRegistrations: number;
    totalRevenue: number;
  };
};

export type TopEventByRegistrationDto = {
  _id: string;
  totalAmount: number;
  seatsCount: number;
  event: Pick<EventDto, "title" | "registeredSeats" | "totalSeats">;
};

export type GetTopEventsByRegistrationResponseDto = BaseResponseDto & {
  data: { events: TopEventByRegistrationDto[] };
};

export type EventsByCategoryResponseDto = BaseResponseDto & {
  data: { events: CountDto[] };
};

export type TopEventByRevenueDto = {
  _id: string;
  totalRevenue: number;
  totalSeats: number;
  event: Pick<EventDto, "title" | "location" | "dateTime" | "status" | "photo">;
};

export type GetTopEventsByRevenueResponseDto = BaseResponseDto & {
  data: { events: TopEventByRevenueDto[] };
};

export type EventsStatusResponseDto = BaseResponseDto & {
  data: { events: CountDto[] };
};

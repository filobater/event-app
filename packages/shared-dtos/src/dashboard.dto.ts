import type { BaseResponseDto } from "./base.dto.js";
import type { EventDto } from "./event.dto.js";
import { RegistrationDto } from "./registration.dto.js";

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

export type TopEventByRegistrationDto = RegistrationDto & {
  event: Pick<EventDto, "_id" | "title" | "registeredSeats" | "totalSeats">;
};

export type GetTopEventsByRegistrationResponseDto = BaseResponseDto & {
  data: { events: TopEventByRegistrationDto[] };
};

export type EventsByCategoryResponseDto = BaseResponseDto & {
  data: { events: CountDto[] };
};

export type TopEventByRevenueDto = RegistrationDto & {
  event: Pick<
    EventDto,
    "_id" | "title" | "location" | "dateTime" | "status" | "photo"
  >;
};

export type GetTopEventsByRevenueResponseDto = BaseResponseDto & {
  data: { events: TopEventByRevenueDto[] };
};

export type EventsStatusResponseDto = BaseResponseDto & {
  data: { events: CountDto[] };
};

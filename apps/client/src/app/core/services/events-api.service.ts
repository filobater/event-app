import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@events-app/endpoints';
import type {
  CreateEventRequestDto,
  EventResponseDto,
  UpdateEventRequestDto,
  UpdateEventResponseDto,
  DeleteEventResponseDto,
  EventDto,
} from '@events-app/shared-dtos';
import { createPaginatedResource } from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class EventsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseEventsUrl = `${environment.apiUrl}${API_ENDPOINTS.events.base}`;

  // Admin actions

  createEvent(data: CreateEventRequestDto): Observable<EventResponseDto> {
    return this.http.post<EventResponseDto>(
      `${this.baseEventsUrl}${API_ENDPOINTS.events.create}`,
      data,
    );
  }

  updateEvent(id: string, data: UpdateEventRequestDto): Observable<UpdateEventResponseDto> {
    return this.http.patch<UpdateEventResponseDto>(
      `${this.baseEventsUrl}${API_ENDPOINTS.events.byId.replace(':id', id)}`,
      data,
    );
  }

  deleteEvent(id: string): Observable<DeleteEventResponseDto> {
    return this.http.delete<DeleteEventResponseDto>(
      `${this.baseEventsUrl}${API_ENDPOINTS.events.byId.replace(':id', id)}`,
    );
  }

  // User actions

  getAllEvents() {
    return createPaginatedResource<EventDto, 'events'>(
      () => `${this.baseEventsUrl}${API_ENDPOINTS.events.getAll}`,
      'events',
    );
  }

  getEvent(id: string): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(
      `${this.baseEventsUrl}${API_ENDPOINTS.events.byId.replace(':id', id)}`,
    );
  }
}

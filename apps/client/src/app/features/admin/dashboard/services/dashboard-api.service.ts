import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@events-app/endpoints';
import type {
  DashboardStatsResponseDto,
  GetTopEventsByRegistrationResponseDto,
  EventsByCategoryResponseDto,
  GetTopEventsByRevenueResponseDto,
  EventsStatusResponseDto,
} from '@events-app/shared-dtos';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.admin.dashboard.base}`;

  getStats(): Observable<DashboardStatsResponseDto> {
    return this.http.get<DashboardStatsResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.admin.dashboard.stats}`,
    );
  }

  getTopEventsByRegistration(): Observable<GetTopEventsByRegistrationResponseDto> {
    return this.http.get<GetTopEventsByRegistrationResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.admin.dashboard.topEventsByRegistration}`,
    );
  }

  getEventsByCategory(): Observable<EventsByCategoryResponseDto> {
    return this.http.get<EventsByCategoryResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.admin.dashboard.eventsByCategory}`,
    );
  }

  getTopEventsByRevenue(): Observable<GetTopEventsByRevenueResponseDto> {
    return this.http.get<GetTopEventsByRevenueResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.admin.dashboard.topEventsByRevenue}`,
    );
  }

  getEventsStatus(): Observable<EventsStatusResponseDto> {
    return this.http.get<EventsStatusResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.admin.dashboard.eventsStatus}`,
    );
  }
}

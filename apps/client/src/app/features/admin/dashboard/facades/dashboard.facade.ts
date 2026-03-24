import { inject, Injectable, signal } from '@angular/core';
import { DashboardApiService } from '../services/dashboard-api.service';
import { RequestStateClass } from 'src/app/core/request-state';
import { forkJoin } from 'rxjs';
import type {
  DashboardStatsResponseDto,
  TopEventByRegistrationDto,
  CountDto,
  TopEventByRevenueDto,
} from '@events-app/shared-dtos';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly api = inject(DashboardApiService);

  readonly loadState = new RequestStateClass();

  readonly stats = signal<DashboardStatsResponseDto['data'] | null>(null);
  readonly topEventsByRegistration = signal<TopEventByRegistrationDto[]>([]);
  readonly eventsByCategory = signal<CountDto[]>([]);
  readonly topEventsByRevenue = signal<TopEventByRevenueDto[]>([]);
  readonly eventsStatus = signal<CountDto[]>([]);

  loadDashboard(): void {
    this.loadState.start();

    forkJoin({
      stats: this.api.getStats(),
      topEventsByRegistration: this.api.getTopEventsByRegistration(),
      eventsByCategory: this.api.getEventsByCategory(),
      topEventsByRevenue: this.api.getTopEventsByRevenue(),
      eventsStatus: this.api.getEventsStatus(),
    }).subscribe({
      next: (res) => {
        this.stats.set(res.stats.data);
        this.topEventsByRegistration.set(res.topEventsByRegistration.data.events);
        this.eventsByCategory.set(res.eventsByCategory.data.events);
        this.topEventsByRevenue.set(res.topEventsByRevenue.data.events);
        this.eventsStatus.set(res.eventsStatus.data.events);
        this.loadState.success();
      },
      error: (err) => this.loadState.fail(err),
    });
  }
}

import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TopEventByRevenueDto } from '@events-app/shared-dtos';
import { LucideAngularModule, MapPin, Calendar, Clock } from 'lucide-angular';
import { NAV } from 'src/app/core';
import BadgeComponent from 'src/app/shared/components/badge/badge.component';
import { STATUS_BADGE_COLORS } from 'src/app/shared/constants';
import { TitleCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top-revenue-event-card',
  standalone: true,
  imports: [LucideAngularModule, BadgeComponent, TitleCasePipe, DatePipe],
  template: `
    <div
      class="flex items-center gap-4 p-3 rounded-xl bg-(--gray-color)/50 hover:bg-(--gray-color)/90 transition-colors cursor-pointer"
    >
      <span class="text-2xl font-display font-bold text-(--light-gray-color) w-8 text-center">{{
        rank()
      }}</span>

      <div class="avatar">
        <div class="w-12 rounded-xl">
          <img [src]="baseUrl + '/' + event().event.photo" [alt]="event().event.title" />
        </div>
      </div>

      <div class="flex-1">
        <p class="text-white font-medium truncate">{{ event().event.title }}</p>
        <div class="flex items-center gap-3 text-xs" [style.color]="'var(--light-gray-color)'">
          <span class="flex items-center gap-1">
            <i-lucide [img]="MapPinIcon" class="size-3" />
            {{ event().event.location }}
          </span>
          <span class="flex items-center gap-1">
            <i-lucide [img]="ClockIcon" class="size-3" />
            {{ event().event.dateTime | date: 'shortDate' }}
          </span>
        </div>
      </div>
      <div class="items-center gap-2 md:flex hidden">
        <div class="text-right">
          <p class="text-(--main-color) font-bold">\${{ event().totalAmount }}</p>
          <p class="text-xs" [style.color]="'var(--light-gray-color)'">
            {{ event().seatsCount }} seats
          </p>
        </div>
        <app-badge [label]="event().status | titlecase" [color]="getStatusColor(event().status)" />
      </div>
    </div>
  `,
})
export default class TopRevenueEventCardComponent {
  readonly MapPinIcon = MapPin;
  readonly ClockIcon = Clock;
  readonly nav = NAV;
  readonly baseUrl = environment.apiUrl;
  event = input.required<TopEventByRevenueDto>();
  rank = input.required<number>();
  readonly router = inject(Router);

  getStatusColor(status: string): string {
    return STATUS_BADGE_COLORS[status] ?? '';
  }
}

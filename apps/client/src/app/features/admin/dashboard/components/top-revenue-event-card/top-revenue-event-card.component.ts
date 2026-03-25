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
      (click)="router.navigate([nav.event(event().event._id)])"
      class="flex items-center md:gap-4 gap-2 p-3 rounded-xl bg-(--gray-color)/50 hover:bg-(--gray-color)/90 transition-colors cursor-pointer"
    >
      <span
        class="md:text-2xl text-xl font-display font-bold text-(--light-gray-color) text-center"
        >{{ rank() }}</span
      >

      <div class="avatar">
        <div class="md:w-12 w-10 rounded-xl">
          <img [src]="baseUrl + '/' + event().event.photo" [alt]="event().event.title" />
        </div>
      </div>

      <div class="flex-1">
        <p class="text-white font-medium truncate md:text-base text-sm line-clamp-1">
          {{ event().event.title }}
        </p>
        <div class="flex items-center gap-3 text-xs" [style.color]="'var(--light-gray-color)'">
          <span class="flex items-center gap-1">
            <i-lucide [img]="MapPinIcon" class="size-3" />
            <span class="line-clamp-1">{{ event().event.location }}</span>
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
            {{ event().seatsCount }} seat(s)
          </p>
        </div>
        <app-badge
          [label]="event().event.status | titlecase"
          [color]="getStatusColor(event().event.status)"
        />
      </div>
    </div>
  `,
})
export default class TopRevenueEventCardComponent {
  readonly MapPinIcon = MapPin;
  readonly ClockIcon = Clock;
  readonly nav = NAV;
  readonly baseUrl = environment.apiUrl;
  readonly router = inject(Router);
  event = input.required<TopEventByRevenueDto>();
  rank = input.required<number>();

  getStatusColor(status: string): string {
    return STATUS_BADGE_COLORS[status] ?? '';
  }
}

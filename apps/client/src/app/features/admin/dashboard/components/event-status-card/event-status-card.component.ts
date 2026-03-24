import { Component, input } from '@angular/core';
import BadgeComponent from 'src/app/shared/components/badge/badge.component';
import { STATUS_BADGE_COLORS } from 'src/app/shared/constants';

export interface EventStatus {
  count: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-event-status-card',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div
      class="flex flex-col items-center justify-center gap-2 rounded-xl p-6 bg-(--dark-gray-color) border border-(--border-color)"
    >
      <p class="text-4xl font-bold text-white">{{ status().count }}</p>
      <app-badge [label]="status().status" [color]="getStatusColor(status().status)" />
    </div>
  `,
})
export default class EventStatusCardComponent {
  status = input.required<EventStatus>();

  getStatusColor(status: string): string {
    return STATUS_BADGE_COLORS[status] ?? '';
  }
}

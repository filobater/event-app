import { Component, input } from '@angular/core';
import { CountDto } from '@events-app/shared-dtos';
import BadgeComponent from 'src/app/shared/components/badge/badge.component';
import { STATUS_BADGE_COLORS } from 'src/app/shared/constants';

@Component({
  selector: 'app-event-status-card',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div
      class="flex flex-col items-center justify-center gap-2 rounded-xl p-4 bg-(--dark-gray-color) border border-(--border-color)"
    >
      <p class="text-4xl font-bold text-white">{{ data().count }}</p>
      <app-badge [label]="data()._id" [color]="getStatusColor(data()._id)" />
    </div>
  `,
})
export default class EventStatusCardComponent {
  data = input.required<CountDto>();

  getStatusColor(status: CountDto['_id']): string {
    return STATUS_BADGE_COLORS[status] ?? '';
  }
}

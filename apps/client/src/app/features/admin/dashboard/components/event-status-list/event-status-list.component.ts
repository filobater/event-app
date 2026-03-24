import { Component } from '@angular/core';
import EventStatusCardComponent, {
  type EventStatus,
} from '../event-status-card/event-status-card.component';

@Component({
  selector: 'app-event-status-list',
  standalone: true,
  imports: [EventStatusCardComponent],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      @for (status of statuses; track status.status) {
        <app-event-status-card [status]="status" />
      }
    </div>
  `,
})
export default class EventStatusListComponent {
  readonly statuses: EventStatus[] = [
    { count: 12, status: 'upcoming' },
    { count: 1, status: 'ongoing' },
    { count: 1, status: 'completed' },
  ];
}

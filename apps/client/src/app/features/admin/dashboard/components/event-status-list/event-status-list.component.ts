import { Component, computed, input } from '@angular/core';
import EventStatusCardComponent from '../event-status-card/event-status-card.component';
import { CountDto } from '@events-app/shared-dtos';

@Component({
  selector: 'app-event-status-list',
  standalone: true,
  imports: [EventStatusCardComponent],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-4">
      @for (data of eventsStatus(); track data._id) {
        <app-event-status-card [data]="data"  class="flex-1"/>
      }
    </div>
  `,
})
export default class EventStatusListComponent {
  eventsStatus = input<CountDto[] | null>();
}

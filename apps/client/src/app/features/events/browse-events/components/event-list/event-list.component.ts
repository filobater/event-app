import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventDto } from '@events-app/shared-dtos';
import { NAV } from 'src/app/core/navigation';
import EventCardComponent from '../event-card/event-card.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventCardComponent, RouterModule],
  template: `
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      @for (event of events(); track event._id) {
        <div (click)="goToDetails(event._id)" class="cursor-pointer">
          <app-event-card [event]="event"></app-event-card>
        </div>
      }
    </div>
    @if (events().length === 0) {
      <div class="flex flex-col h-[50vh] items-center justify-center">
        <div class="text-center text-gray-500">No events found.</div>
      </div>
    }
  `,
})
export default class EventListComponent {
  readonly events = input.required<EventDto[]>();
  private readonly router = inject(Router);

  goToDetails(id: string) {
    this.router.navigate([NAV.event(id)]);
  }
}

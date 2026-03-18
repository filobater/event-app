import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-details-page',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-white">Event Details</h1>
      <p class="text-(--light-gray-color)">Event ID: {{ eventId }}</p>
    </div>
  `,
})
export default class EventDetailsPageComponent {
  readonly route = inject(ActivatedRoute);
  readonly eventId = this.route.snapshot.paramMap.get('id');

  constructor() {}
}


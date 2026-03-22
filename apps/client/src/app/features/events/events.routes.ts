import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from 'src/app/core';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./browse-events/pages/browse-events.component').then((m) => m.default),
    title: 'Events',
  },
  {
    path: ROUTE_SEGMENTS.events.details,
    loadComponent: () =>
      import('./event-details/pages/event-details.component').then((m) => m.default),
    title: 'Event Details',
  },
];

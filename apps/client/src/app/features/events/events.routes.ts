import { Routes } from '@angular/router';
import { NAV } from 'src/app/core';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./browse-events/pages/browse-events.component'),
    title: 'Events',
  },
  {
    path: NAV.event(':id').replace('/', ''),
    loadComponent: () =>
      import('./event-details/pages/event-details.component'),
    title: 'Event Details',
  },
];

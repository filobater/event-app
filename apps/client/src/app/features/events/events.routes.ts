import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from 'src/app/core';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./browse-events/pages/browse-events.component'),
    title: 'Events',
  },
  {
    path: ROUTE_SEGMENTS.events.details,
    loadComponent: () => import('./event-details/pages/event-details.component'),
    title: 'Event Details',
  },
];

import { Routes } from '@angular/router';
import { NAV } from 'src/app/core';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/public-events/public-events.component'),
    title: 'Events',
  },
  {
    path: NAV.event(':id').replace('/', ''),
    loadComponent: () => import('./pages/event-details/event-details.page'),
    title: 'Event Details',
  },
];

import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from 'src/app/core';

const SEGMENT_NAMES = ROUTE_SEGMENTS.admin;

export const adminRoutes: Routes = [
  {
    path: SEGMENT_NAMES.users,
    loadComponent: () => import('./users/pages/users.component'),
    title: 'Admin - Users',
  },
  {
    path: SEGMENT_NAMES.events,
    loadComponent: () => import('./events/pages/events.component'),
    title: 'Admin - Events',
  },
];

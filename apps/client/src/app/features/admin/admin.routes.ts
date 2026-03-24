import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from 'src/app/core';

const SEGMENT_NAMES = ROUTE_SEGMENTS.admin;

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: SEGMENT_NAMES.dashboard,
    pathMatch: 'full',
  },
  {
    path: SEGMENT_NAMES.dashboard,
    loadComponent: () => import('./dashboard/pages/dashboard.component').then((m) => m.default),
    title: 'Admin - Dashboard',
  },
  {
    path: SEGMENT_NAMES.users,
    loadComponent: () => import('./users/pages/users.component').then((m) => m.default),
    title: 'Admin - Users',
  },
  {
    path: `${SEGMENT_NAMES.users}/:userId/${SEGMENT_NAMES.userRegistrations}`,
    loadComponent: () =>
      import('./users/pages/user-registrations/user-registrations.component').then(
        (m) => m.default,
      ),
    title: 'Admin - User Registrations',
  },
  {
    path: SEGMENT_NAMES.events,
    loadComponent: () => import('./events/pages/events.component').then((m) => m.default),
    title: 'Admin - Events',
  },
];

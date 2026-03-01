import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component'),
    title: 'Admin - Users',
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events.component'),
    title: 'Admin - Events',
  },
];

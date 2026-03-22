import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from 'src/app/core';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/profile.component').then((m) => m.default),
    children: [
      {
        path: ROUTE_SEGMENTS.profile.account,
        loadComponent: () =>
          import('./account-info/pages/account-info.component').then((m) => m.default),
        title: 'Profile - Account',
      },
      {
        path: ROUTE_SEGMENTS.profile.password,
        loadComponent: () =>
          import('./change-password/change-password.component').then((m) => m.default),
        title: 'Profile - Password',
      },
      {
        path: ROUTE_SEGMENTS.profile.registrations,
        loadComponent: () =>
          import('./my-registrations/pages/my-registrations.component').then((m) => m.default),
        title: 'Profile - My Registrations',
      },
    ],
  },
];

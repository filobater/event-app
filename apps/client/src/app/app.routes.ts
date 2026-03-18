import { Routes } from '@angular/router';
import { authGuard, guestGuard, NAV, roleGuard } from './core';
import { AuthLayoutComponent, MainLayoutComponent } from './layouts/';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/events/events.routes').then((m) => m.eventsRoutes),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: NAV.auth.base,
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
        canActivate: [guestGuard],
      },
    ],
  },
  {
    path: NAV.admin.base,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
        canActivate: [roleGuard],
      },
    ],
  },
];

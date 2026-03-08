import { Routes } from '@angular/router';
import { guestGuard, NAV } from './core';

export const routes: Routes = [
  {
    path: NAV.auth.base,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
    canActivate: [guestGuard],
  },
  {
    path: NAV.admin.base,
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
];

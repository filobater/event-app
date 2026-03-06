import { Routes } from '@angular/router';
import { NAV } from './core';

export const routes: Routes = [
  {
    path: NAV.auth.base,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: NAV.admin.base,
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
];

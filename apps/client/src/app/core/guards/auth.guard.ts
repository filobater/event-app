import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NAV } from 'src/app/shared/constants';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return true;

  const userService = inject(UserService);
  const router = inject(Router);
  if (userService.isLoggedIn()) {
    return true;
  }

  router.navigate([NAV.auth.signin]);
  return false;
};

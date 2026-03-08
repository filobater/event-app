import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NAV, BASE_PATH } from '../navigation';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (userService.isLoggedIn()) {
    return true;
  }

  router.navigate([NAV.auth.signin]);
  return false;
};

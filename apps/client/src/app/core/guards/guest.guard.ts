import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { BASE_PATH } from '../navigation';
export const guestGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    return true;
  }

  router.navigate([BASE_PATH]);
  return false;
};

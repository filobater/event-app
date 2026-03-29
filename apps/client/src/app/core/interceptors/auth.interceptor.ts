import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { UserService } from 'src/app/core/services';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { catchError, BehaviorSubject, throwError, switchMap, filter, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/constants';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const userService = inject(UserService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(addToken(req, userService.getToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      const skipRefresh = req.url.includes('refresh');
      if (error.status === 401 && !skipRefresh) {
        return handle401(req, next, userService, authService, router);
      }
      return throwError(() => error);
    }),
  );
};

const addToken = (req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
  return req.clone({
    withCredentials: true,
    ...(token && {
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    }),
  });
};

const handle401 = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  userService: UserService,
  authService: AuthService,
  router: Router,
) => {
  if (isRefreshing) {
    return refreshSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => next(addToken(req, token))),
    );
  }

  isRefreshing = true;
  refreshSubject.next(null);

  return authService.refreshToken().pipe(
    switchMap((res) => {
      isRefreshing = false;
      refreshSubject.next(res.data.token);
      userService.setToken(res.data.token);
      userService.setUser(res.data.user);
      return next(addToken(req, res.data.token));
    }),
    catchError((err) => {
      isRefreshing = false;
      userService.setToken(null);
      userService.setUser(null);
      userService.clearUserScopedCaches();
      router.navigate([NAV.auth.signin]);
      return throwError(() => err);
    }),
  );
};

import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { catchError, BehaviorSubject, throwError, switchMap, filter, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NAV } from '../navigation';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(addToken(req, userService.getToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('refresh')) {
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
      router.navigate([NAV.auth.signin]);
      return throwError(() => err);
    }),
  );
};

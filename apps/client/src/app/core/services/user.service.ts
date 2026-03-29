import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserDto } from '@events-app/shared-dtos';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/constants';
import { RequestStateClass } from 'src/app/core/request-state';
import { CacheService } from './cache.service';
import { RegistrationsFacade } from 'src/app/core/facades/registrations.facade';

@Injectable({ providedIn: 'root' })
export class UserService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private authService = inject(AuthService);
  private cacheService = inject(CacheService);
  private registrationsFacade = inject(RegistrationsFacade);
  readonly requestState = new RequestStateClass();
  private router = inject(Router);

  private user = signal<UserDto | null>(this.getUserFromStorage());
  private token = signal<string | null>(this.getTokenFromStorage());

  currentUser = this.user.asReadonly();
  isLoggedIn = computed(() => !!this.token());

  private getTokenFromStorage(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): UserDto | null {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('user') ?? 'null');
  }

  setUser(user: UserDto | null) {
    if (this.isBrowser) {
      user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user');
    }
    this.user.set(user);
  }

  setToken(token: string | null) {
    if (this.isBrowser) {
      token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
    }
    this.token.set(token);
  }

  getToken(): string | null {
    return this.token();
  }

  setSession(token: string, user: UserDto) {
    this.setToken(token);
    this.setUser(user);
  }

  clearUserScopedCaches(): void {
    this.cacheService.clear();
    this.registrationsFacade.resetMyRegistrationsResource();
  }

  clearSession() {
    this.setToken(null);
    this.setUser(null);
    this.clearUserScopedCaches();
  }

  logout() {
    this.authService.signout().subscribe({
      next: (response) => {
        this.clearSession();
        this.requestState.success(response.message);
        this.router.navigate([NAV.auth.signin]);
      },
      error: (error) => {
        this.requestState.fail(error);
      },
    });
  }
}

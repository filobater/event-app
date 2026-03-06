import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserDto } from '@events-app/shared-dtos';

@Injectable({ providedIn: 'root' })
export class UserService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private user = signal<UserDto | null>(this.getUserFromStorage());

  currentUser = this.user.asReadonly();
  isLoggedIn = computed(() => !!this.user());

  private getUserFromStorage(): UserDto | null {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('user') ?? 'null');
  }

  setUser(user: UserDto) {
    if (this.isBrowser) localStorage.setItem('user', JSON.stringify(user));
    this.user.set(user);
  }

  clearUser() {
    if (this.isBrowser) localStorage.removeItem('user');
    this.user.set(null);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { UsersApiService } from '../services/users-api.service';
import { CacheService } from '../services/cache.service';
import { RequestStateClass } from '../request-state';
import type { CreateUserRequestDto, UserDto, UpdateUserRequestDto } from '@events-app/shared-dtos';

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private readonly api = inject(UsersApiService);
  private readonly cache = inject(CacheService);
  private readonly cacheNamespace = 'users';

  readonly usersResource = this.api.getAllUsers();

  readonly loadUserState = new RequestStateClass();
  readonly mutationState = new RequestStateClass();
  readonly user = signal<UserDto | null>(null);

  loadUser(id: string | null): void {
    this.loadUserState.reset();

    if (!id) {
      this.user.set(null);
      return;
    }

    const cached = this.cache.get<UserDto>(this.cacheNamespace, id);
    if (cached) {
      this.user.set(cached);
      this.loadUserState.success();
      return;
    }

    this.user.set(null);
    this.loadUserState.start();

    this.api.getUser(id).subscribe({
      next: (res) => {
        this.loadUserState.success();
        this.cache.set(this.cacheNamespace, id, res.data.user);
        this.user.set(res.data.user);
      },
      error: (err) => this.loadUserState.fail(err),
    });
  }

  createUser(data: CreateUserRequestDto, onSuccess?: (user: UserDto) => void): void {
    this.mutationState.start();
    this.api.createUser(data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, res.data.user._id, res.data.user);
        this.usersResource.addItem(res.data.user);
        onSuccess?.(res.data.user);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  updateUser(id: string, data: UpdateUserRequestDto, onSuccess?: (user: UserDto) => void): void {
    this.mutationState.start();
    this.api.updateUser(id, data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, id, res.data.user);
        this.usersResource.updateItem(id, res.data.user);
        onSuccess?.(res.data.user);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  deleteUser(id: string, onSuccess?: () => void): void {
    this.mutationState.start();
    this.api.deleteUser(id).subscribe({
      next: () => {
        this.mutationState.success('User deleted successfully');
        this.cache.delete(this.cacheNamespace, id);
        this.usersResource.removeItem(id);
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}

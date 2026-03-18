import { inject, Injectable, signal } from '@angular/core';
import { UsersApiService } from '../services/users-api.service';
import { RequestStateClass } from '../request-state';
import type { CreateUserRequestDto, UserDto, UpdateUserRequestDto } from '@events-app/shared-dtos';

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private readonly api = inject(UsersApiService);

  readonly loadUserState = new RequestStateClass();
  readonly user = signal<UserDto | null>(null);
  readonly mutationState = new RequestStateClass();

  getAllUsers() {
    return this.api.getAllUsers();
  }

  loadUser(id: string | null): void {
    this.user.set(null);
    this.loadUserState.reset();
    if (!id) return;

    this.loadUserState.start();
    this.api.getUser(id).subscribe({
      next: (res) => {
        this.loadUserState.success();
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
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}

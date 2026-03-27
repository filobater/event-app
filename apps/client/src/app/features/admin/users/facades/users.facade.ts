import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { defer, firstValueFrom, from, switchMap } from 'rxjs';
import { UsersApiService } from '../services/users-api.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { RequestStateClass } from 'src/app/core/request-state';
import { UploadService } from 'src/app/core/services/upload.service';
import { ToastService } from 'src/app/core/toast.service';
import type { CreateUserRequestDto, UserDto, UpdateUserRequestDto } from '@events-app/shared-dtos';

export type SaveUserOptions = {
  onSuccess?: (user: UserDto) => void;
  /** After upload succeeds, patch the form so the control holds the URL (avoids re-uploading the same file). */
  onProfilePictureUrlApplied?: (url: string) => void;
};

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private readonly api = inject(UsersApiService);
  private readonly cache = inject(CacheService);
  private readonly uploadService = inject(UploadService);
  private readonly toastService = inject(ToastService);
  private readonly injector = inject(Injector);
  private readonly cacheNamespace = 'users';

  private _usersResource?: ReturnType<UsersApiService['getAllUsers']>;

  get usersResource() {
    this._usersResource ??= runInInjectionContext(this.injector, () => this.api.getAllUsers());
    return this._usersResource;
  }

  readonly loadUserState = new RequestStateClass();
  readonly mutationState = new RequestStateClass();
  readonly uploadState = new RequestStateClass();
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

  saveUser(user: CreateUserRequestDto | UpdateUserRequestDto, options?: SaveUserOptions): void {
    if ('_id' in user && user._id) {
      this.updateUser(user._id, user, options);
    } else {
      this.createUser(user as CreateUserRequestDto, options);
    }
  }

  createUser(data: CreateUserRequestDto, options?: SaveUserOptions): void {
    this.buildUserMutation$(
      data,
      (payload) => this.api.createUser(payload as CreateUserRequestDto),
      options,
    ).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, res.data.user._id, res.data.user);
        this.usersResource.addItem(res.data.user);
        options?.onSuccess?.(res.data.user);
      },
      error: (err) => this.handleUserSaveError(err),
    });
  }

  updateUser(id: string, data: UpdateUserRequestDto, options?: SaveUserOptions): void {
    this.buildUserMutation$(
      data,
      (payload) => this.api.updateUser(id, payload as UpdateUserRequestDto),
      options,
    ).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, id, res.data.user);
        this.usersResource.updateItem(id, res.data.user);
        options?.onSuccess?.(res.data.user);
      },
      error: (err) => this.handleUserSaveError(err),
    });
  }

  private buildUserMutation$(
    data: CreateUserRequestDto | UpdateUserRequestDto,
    apiCall: (
      payload: CreateUserRequestDto | UpdateUserRequestDto,
    ) => ReturnType<UsersApiService['createUser']> | ReturnType<UsersApiService['updateUser']>,
    options?: SaveUserOptions,
  ) {
    return defer(() => {
      const pic = data.profilePicture as File | string | null | undefined;
      if (pic instanceof File) {
        this.uploadState.start();
        const upload$ = this.uploadService.uploadSingle(pic, 'profilePicture');
        const uploadPromise = firstValueFrom(upload$);
        this.toastService.promise(uploadPromise, {
          loading: 'Uploading profile picture...',
          success: (res) => res.message,
        });
        return from(uploadPromise).pipe(
          switchMap((uploadRes) => {
            options?.onProfilePictureUrlApplied?.(uploadRes.data.url);
            this.uploadState.success();
            this.mutationState.start();
            return apiCall({ ...data, profilePicture: uploadRes.data.url });
          }),
        );
      }

      this.mutationState.start();
      return apiCall({ ...data, profilePicture: pic });
    });
  }

  private handleUserSaveError(err: HttpErrorResponse): void {
    if (this.uploadState.loading()) {
      this.uploadState.fail(err, { differentToast: true });
    } else {
      this.mutationState.fail(err);
    }
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

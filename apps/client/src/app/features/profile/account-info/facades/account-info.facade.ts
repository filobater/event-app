import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { defer, firstValueFrom, from, switchMap } from 'rxjs';
import type {
  UpdateUserProfileRequestDto,
  UpdateUserProfileResponseDto,
} from '@events-app/shared-dtos';
import { ProfileService } from '../../services/profile.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { ToastService } from 'src/app/core/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import { RequestStateClass } from 'src/app/core/request-state';

export type SubmitAccountProfileOptions = {
  onProfilePictureUrlApplied?: (url: string) => void;
  onSuccess?: (res: UpdateUserProfileResponseDto) => void;
};

@Injectable({ providedIn: 'root' })
export class AccountInfoFacade {
  private readonly profileService = inject(ProfileService);
  private readonly uploadService = inject(UploadService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);

  readonly uploadState = new RequestStateClass();
  readonly updateProfileState = new RequestStateClass();

  submitProfile(
    dirty: Record<string, unknown>,
    profilePicture: File | string | null | undefined,
    options: SubmitAccountProfileOptions = {},
  ): void {
    this.buildSave$(dirty, profilePicture, options.onProfilePictureUrlApplied).subscribe({
      next: (res) => {
        this.updateProfileState.success(res.message);
        this.userService.setUser(res.data.user);
        options.onSuccess?.(res);
      },
      error: (error) => this.handleProfileSaveError(error),
    });
  }

  handleProfileSaveError(err: HttpErrorResponse): void {
    if (this.uploadState.loading()) {
      this.uploadState.fail(err, { differentToast: true });
    } else {
      this.updateProfileState.fail(err);
    }
  }

  private buildSave$(
    dirty: Record<string, unknown>,
    profilePicture: File | string | null | undefined,
    onProfilePictureUrlApplied?: (url: string) => void,
  ) {
    return defer(() => {
      if (profilePicture instanceof File) {
        this.uploadState.start();
        const upload$ = this.uploadService.uploadSingle(profilePicture, 'profilePicture');
        const uploadPromise = firstValueFrom(upload$);
        this.toastService.promise(uploadPromise, {
          loading: 'Uploading profile picture...',
          success: (res) => res.message,
        });
        return from(uploadPromise).pipe(
          switchMap((uploadRes) => {
            dirty['profilePicture'] = uploadRes.data.url;
            this.uploadState.success();
            onProfilePictureUrlApplied?.(uploadRes.data.url);
            this.updateProfileState.start();
            return this.profileService.updateProfile(dirty as UpdateUserProfileRequestDto);
          }),
        );
      }

      this.updateProfileState.start();
      return this.profileService.updateProfile(dirty as UpdateUserProfileRequestDto);
    });
  }
}

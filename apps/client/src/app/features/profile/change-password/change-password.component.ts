import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lock, LucideAngularModule } from 'lucide-angular';
import {
  ErrorMessageComponent,
  PasswordInputComponent,
  PrimaryButtonComponent,
} from 'src/app/shared/components';
import { confirmPasswordValidator } from 'src/app/shared/utils';
import { ProfileService } from '../services/profile.service';
import { RequestStateClass } from 'src/app/core/request-state';
import { UpdateUserPasswordRequestDto } from '@events-app/shared-dtos';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordInputComponent,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    LucideAngularModule,
  ],
  templateUrl: './change-password.component.html',
})
export default class ChangePasswordComponent {
  readonly LockIcon = Lock;

  private readonly fb = inject(FormBuilder);
  readonly profileService = inject(ProfileService);
  updatePasswordState = new RequestStateClass();

  form = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: confirmPasswordValidator() },
  );

  get formControls() {
    return {
      currentPassword: this.form.get('currentPassword'),
      password: this.form.get('password'),
      confirmPassword: this.form.get('confirmPassword'),
    };
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.updatePasswordState.start();
    this.profileService
      .updatePassword({
        ...this.form.value,
        newPassword: this.form.value.password!,
      } as UpdateUserPasswordRequestDto)
      .subscribe({
        next: (res) => {
          this.form.reset();
          this.updatePasswordState.success(res.message);
        },
        error: (err) => {
          this.updatePasswordState.fail(err);
        },
      });
  }
}

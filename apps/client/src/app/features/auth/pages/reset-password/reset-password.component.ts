import { Component, inject } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import {
  PasswordInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utils';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    AuthCardComponent,
    PasswordInputComponent,
    RouterLink,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
})
export default class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  resetPasswordForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', []],
    },
    { validators: confirmPasswordValidator() },
  );
  get password() {
    return this.resetPasswordForm.get('password');
  }
  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }
  handleResetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    console.log(this.resetPasswordForm.value);
  }
}

import { Component, effect, inject } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import {
  PasswordInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utils';
import { AuthService } from '../../services/auth..service';
import { RequestStateClass, BASE_PATH, NAV, UserService } from 'src/app/core';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordRequestDto } from '@events-app/shared-dtos';

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
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  protected readonly nav = NAV;
  // this to handle the error and loading state
  requestState = new RequestStateClass();
  snapshot = this.route.snapshot;
  resetToken = this.snapshot.queryParams['resetToken'];
  constructor() {
    effect(() => {
      if (!this.resetToken) {
        this.router.navigate([this.nav.auth.signin]);
      }
    });
  }
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
    this.requestState.start();
    this.authService
      .resetPassword(this.resetToken, this.resetPasswordForm.value as ResetPasswordRequestDto)
      .subscribe({
        next: (response) => {
          this.requestState.success(response.message);
          this.userService.setUser(response.data.user);
          this.router.navigate([BASE_PATH]);
        },
        error: (error) => {
          this.requestState.fail(error);
        },
      });
  }
}

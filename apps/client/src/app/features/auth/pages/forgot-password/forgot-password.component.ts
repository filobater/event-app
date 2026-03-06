import { Component, inject } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import {
  TextInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth..service';
import { RequestStateClass } from 'src/app/core';
import { ForgotPasswordRequestDto } from '@events-app/shared-dtos';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    AuthCardComponent,
    TextInputComponent,
    RouterLink,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
})
export default class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  // this to handle the error and loading state
  requestState = new RequestStateClass();
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  get email() {
    return this.forgotPasswordForm.get('email');
  }
  handleForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    this.requestState.start();
    this.authService
      .forgotPassword(this.forgotPasswordForm.value as ForgotPasswordRequestDto)
      .subscribe({
        next: (response) => {
          this.requestState.success(response.message);
        },
        error: (error) => {
          this.requestState.fail(error);
        },
      });
  }
}

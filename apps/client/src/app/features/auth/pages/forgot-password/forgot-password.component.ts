import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, Mail } from 'lucide-angular';
import { AuthCardComponent } from 'src/app/features/auth/components';
import {
  TextInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { RequestStateClass } from 'src/app/core';
import { ForgotPasswordRequestDto } from '@events-app/shared-dtos';
import { NAV } from 'src/app/shared/constants';
import { getValidationErrorMessage } from 'src/app/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    AuthCardComponent,
    TextInputComponent,
    RouterLink,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './forgot-password.component.html',
})
export default class ForgotPasswordComponent {
  readonly MailIcon = Mail;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  protected readonly nav = NAV;
  // this to handle the error and loading state
  requestState = new RequestStateClass();
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  get email() {
    return this.forgotPasswordForm.get('email');
  }

  protected getValidationErrorMessage = getValidationErrorMessage;
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

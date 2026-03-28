import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { AuthCardComponent } from 'src/app/features/auth/components';
import {
  TextInputComponent,
  PasswordInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utils';
import { getValidationErrorMessage } from 'src/app/shared/utils';
import { RequestStateClass } from 'src/app/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SignupRequestDto } from '@events-app/shared-dtos';
import { NAV } from 'src/app/shared/constants';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signup',
  standalone: true,
  imports: [
    AuthCardComponent,
    TextInputComponent,
    PasswordInputComponent,
    RouterLink,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './signup.component.html',
})
export default class SignupComponent {
  readonly UserPlusIcon = UserPlus;
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);
  protected readonly nav = NAV;
  // this to handle the error and loading state
  requestState = new RequestStateClass();

  router = inject(Router);

  signupForm = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', []],
    },
    { validators: confirmPasswordValidator() },
  );
  get fullName() {
    return this.signupForm.get('fullName');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  protected getValidationErrorMessage = getValidationErrorMessage;
  handleSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.requestState.start();
    this.authService.signup(this.signupForm.value as SignupRequestDto).subscribe({
      next: (response) => {
        this.requestState.success(response.message);
        this.router.navigate([this.nav.auth.verifyOtp], {
          queryParams: { email: this.email?.value },
        });
      },
      error: (error) => {
        this.requestState.fail(error);
      },
    });
  }
}

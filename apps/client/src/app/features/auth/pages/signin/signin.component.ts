import { Component, inject } from '@angular/core';
import { LucideAngularModule, LogIn } from 'lucide-angular';
import { AuthCardComponent } from '../../ui';
import {
  PasswordInputComponent,
  TextInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ResendOtpRequestDto, SigninRequestDto } from '@events-app/shared-dtos';
import { AuthService } from '../../services/auth.service';
import { BASE_PATH, RequestStateClass, UserService } from 'src/app/core';
import { NAV } from 'src/app/core/navigation';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    AuthCardComponent,
    TextInputComponent,
    PasswordInputComponent,
    RouterLink,
    PrimaryButtonComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    LucideAngularModule,
  ],
  templateUrl: './signin.component.html',
})
export default class SigninComponent {
  readonly LogInIcon = LogIn;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);
  protected readonly nav = NAV;

  // this to handle the error and loading state
  requestState = new RequestStateClass();

  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  get email() {
    return this.signinForm.get('email');
  }
  get password() {
    return this.signinForm.get('password');
  }

  private handleUnVerifiedUser() {
    this.authService.resendOtp({ email: this.email?.value } as ResendOtpRequestDto).subscribe({
      next: () => {
        this.requestState.success();
        this.router.navigate([this.nav.auth.verifyOtp], {
          queryParams: { email: this.email?.value },
        });
      },
      error: (error) => {
        this.requestState.fail(error);
      },
    });
  }

  handleSignin() {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    this.requestState.start();
    this.authService.signin(this.signinForm.value as SigninRequestDto).subscribe({
      next: (response) => {
        this.requestState.success();
        this.userService.setUser(response.data.user);
        this.userService.setToken(response.data.token);
        this.router.navigate([BASE_PATH]);
      },
      error: (error) => {
        if (error.error.message.includes('Please verify your account')) {
          this.handleUnVerifiedUser();
        } else {
          this.requestState.fail(error);
        }
      },
    });
  }
}

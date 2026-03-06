import { Component, inject } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import {
  ErrorMessageComponent,
  OtpInputComponent,
  PrimaryButtonComponent,
} from 'src/app/shared/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth..service';
import { RequestStateClass } from 'src/app/core';
import { VerifyOtpRequestDto } from '@events-app/shared-dtos';
import { NAV } from 'src/app/core/navigation';
@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    AuthCardComponent,
    OtpInputComponent,
    PrimaryButtonComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
  ],
  templateUrl: './otp.component.html',
})
export default class OtpComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected readonly nav = NAV;
  // this to handle the error and loading state
  requestState = new RequestStateClass();
  snapshot = this.route.snapshot;
  email = this.snapshot.queryParams['email'];
  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });
  get otp() {
    return this.otpForm.get('otp');
  }
  handleVerifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.requestState.start();
    this.authService
      .verifyOtp({ email: this.email, otp: this.otp?.value } as VerifyOtpRequestDto)
      .subscribe({
        next: (response) => {
          this.requestState.success();
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.router.navigate([this.nav.auth.signin]);
        },
        error: (error) => {
          this.requestState.fail(error);
        },
      });
  }
}

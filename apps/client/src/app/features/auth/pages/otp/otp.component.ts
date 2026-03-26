import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, ShieldCheck } from 'lucide-angular';
import { AuthCardComponent } from '../../components';
import { OtpInputComponent, PrimaryButtonComponent } from 'src/app/shared/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestStateClass, UserService } from 'src/app/core';
import { VerifyOtpRequestDto } from '@events-app/shared-dtos';
import { NAV } from 'src/app/core/navigation';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-otp',
  standalone: true,
  imports: [
    AuthCardComponent,
    OtpInputComponent,
    PrimaryButtonComponent,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './otp.component.html',
})
export default class OtpComponent {
  readonly ShieldCheckIcon = ShieldCheck;
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected readonly nav = NAV;
  private userService = inject(UserService);
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
          this.requestState.success(response.message);
          this.userService.setUser(response.data.user);
          this.userService.setToken(response.data.token);
          this.router.navigate([this.nav.auth.signin]);
        },
        error: (error) => {
          this.requestState.fail(error);
        },
      });
  }
}

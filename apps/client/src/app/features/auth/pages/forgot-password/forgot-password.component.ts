import { Component, inject } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import { TextInputComponent, PrimaryButtonComponent, ErrorMessageComponent } from 'src/app/shared/components';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [AuthCardComponent, TextInputComponent, RouterLink, PrimaryButtonComponent, ErrorMessageComponent, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
})
export default class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
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
    console.log(this.forgotPasswordForm.value);
  }
}

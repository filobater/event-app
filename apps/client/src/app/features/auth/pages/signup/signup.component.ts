import { Component, inject } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import {
  TextInputComponent,
  PasswordInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utils';

@Component({
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
  ],
  templateUrl: './signup.component.html',
})
export default class SignupComponent {
  private fb = inject(FormBuilder);
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
  handleSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    console.log(this.signupForm.value);
  }
}

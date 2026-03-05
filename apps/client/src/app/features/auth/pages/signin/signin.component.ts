import { Component, inject } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import {
  PasswordInputComponent,
  TextInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
  ],
  templateUrl: './signin.component.html',
})
export default class SigninComponent {
  private fb = inject(FormBuilder);

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
  handleSignin() {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }
    console.log(this.signinForm.value);
  }
}

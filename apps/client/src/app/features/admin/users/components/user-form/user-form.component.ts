import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TextInputComponent,
  PasswordInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
  ImageUploadComponent,
  SelectInputComponent,
  SecondaryButtonComponent,
} from 'src/app/shared/components';
import { CreateUserRequestDto } from '@events-app/shared-dtos';
import { confirmPasswordValidator } from 'src/app/shared/utils';
import { RequestStateClass } from 'src/app/core/request-state';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    TextInputComponent,
    PasswordInputComponent,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ImageUploadComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    SecondaryButtonComponent,
  ],
  templateUrl: './user-form.component.html',
})
export default class UserFormComponent {
  private fb = inject(FormBuilder);
  requestState = input<RequestStateClass>();
  closed = output<void>();
  onSave = output<CreateUserRequestDto | Partial<CreateUserRequestDto>>();
  readonly roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ];

  userForm = this.fb.group(
    {
      profilePicture: [null],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      role: [''],
    },
    { validators: confirmPasswordValidator() },
  );

  get formData() {
    return {
      profilePicture: this.userForm.get('profilePicture'),
      fullName: this.userForm.get('fullName'),
      email: this.userForm.get('email'),
      password: this.userForm.get('password'),
      confirmPassword: this.userForm.get('confirmPassword'),
      role: this.userForm.get('role'),
    };
  }

  handleCancel() {
    this.userForm.reset();
    this.closed.emit();
  }

  handleSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.onSave.emit(this.userForm.value as Partial<CreateUserRequestDto>);
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
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
import { CreateUserRequestDto, UpdateUserRequestDto, UserDto } from '@events-app/shared-dtos';
import { confirmPasswordValidator, getValidationErrorMessage } from 'src/app/shared/utils';
import { RequestStateClass } from 'src/app/core/request-state';
import { getDirtyFields } from 'src/app/shared/utils/get-dirty-fields.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  user = input<UserDto | null>(null);
  isEdit = computed(() => !!this.user());
  closed = output<void>();
  onSave = output<CreateUserRequestDto | UpdateUserRequestDto>();
  readonly roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ];

  userForm = this.fb.nonNullable.group(
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

  constructor() {
    effect(() => {
      const passwordControl = this.userForm.get('password');
      const confirmPasswordControl = this.userForm.get('confirmPassword');
      const emailControl = this.userForm.get('email');
      if (this.isEdit()) {
        emailControl?.disable();
        passwordControl?.clearValidators();
        confirmPasswordControl?.clearValidators();

        this.userForm.patchValue(this.user() as unknown as UpdateUserRequestDto);
      } else {
        emailControl?.enable();
        passwordControl?.setValidators([Validators.required, Validators.minLength(8)]);
        confirmPasswordControl?.setValidators([Validators.required, Validators.minLength(8)]);
      }
      passwordControl?.updateValueAndValidity();
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

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

  protected getValidationErrorMessage = getValidationErrorMessage;

  handleCancel() {
    this.userForm.reset();
    this.closed.emit();
  }

  handleSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isEdit()) {
      const dirtyFields = getDirtyFields(this.userForm);
      this.onSave.emit({ ...dirtyFields, _id: this.user()?._id } as UpdateUserRequestDto);
    } else {
      this.onSave.emit(this.userForm.value as CreateUserRequestDto);
    }
  }
}

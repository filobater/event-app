import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CalendarDays, LucideAngularModule, User } from 'lucide-angular';
import {
  BadgeComponent,
  ErrorMessageComponent,
  ImageUploadComponent,
  PrimaryButtonComponent,
  TextInputComponent,
} from 'src/app/shared/components';
import AccountInfoSkeletonComponent from '../components/account-info-skeleton/account-info-skeleton.component';
import { getDirtyFields } from 'src/app/shared/utils/get-dirty-fields.utils';
import { ProfileService } from '../../services/profile.service';
import { UserDto } from '@events-app/shared-dtos';
import { RequestStateClass } from 'src/app/core/request-state';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ImageUploadComponent,
    BadgeComponent,
    TitleCasePipe,
    DatePipe,
    LucideAngularModule,
    AccountInfoSkeletonComponent,
  ],
  templateUrl: './account-info.component.html',
})
export default class AccountInfoComponent {
  readonly UserIcon = User;
  readonly CalendarIcon = CalendarDays;

  private readonly fb = inject(FormBuilder);

  readonly profileService = inject(ProfileService);
  readonly userService = inject(UserService);

  user = signal<UserDto | null>(null);
  getMeState = new RequestStateClass();
  updateProfileState = new RequestStateClass();

  form = this.fb.nonNullable.group({
    profilePicture: this.fb.control<File | string | null>(null),
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.getMeState.start();
    this.profileService.getMe().subscribe({
      next: (res) => {
        this.user.set(res.data.user);
        this.form.controls.email.disable();
        this.form.patchValue({
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          profilePicture: res.data.user.profilePicture ?? null,
        });
        this.getMeState.success();
      },
      error: (err) => {
        this.getMeState.fail(err);
      },
    });
  }
  get formControls() {
    return {
      profilePicture: this.form.get('profilePicture'),
      fullName: this.form.get('fullName'),
      email: this.form.get('email'),
    };
  }

  get roleBadgeColor(): string {
    return this.user()?.role === 'admin' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white';
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dirty = getDirtyFields(this.form);
    if (Object.keys(dirty).length === 0) return;
    this.updateProfileState.start();
    this.profileService.updateProfile(dirty).subscribe({
      next: (res) => {
        this.updateProfileState.success(res.message);
        this.user.set(res.data.user);
        this.userService.setUser(res.data.user);
      },
      error: (err) => {
        this.updateProfileState.fail(err);
      },
    });
  }
}

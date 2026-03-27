import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CalendarDays, LucideAngularModule, User, Coins } from 'lucide-angular';
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
import { AccountInfoFacade } from '../facades/account-info.facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    CurrencyPipe,
  ],
  templateUrl: './account-info.component.html',
})
export default class AccountInfoComponent {
  readonly UserIcon = User;
  readonly CalendarIcon = CalendarDays;
  readonly CoinsIcon = Coins;

  private readonly fb = inject(FormBuilder);

  readonly profileService = inject(ProfileService);
  readonly accountInfoFacade = inject(AccountInfoFacade);

  user = signal<UserDto | null>(null);
  getMeState = new RequestStateClass();

  readonly updateProfileState = this.accountInfoFacade.updateProfileState;
  readonly uploadState = this.accountInfoFacade.uploadState;

  form = this.fb.nonNullable.group({
    profilePicture: this.fb.control<File | string | null>(null),
    fullName: ['', [Validators.required]],
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

    const profilePicture = this.formControls?.profilePicture?.value;

    this.accountInfoFacade.submitProfile(dirty, profilePicture, {
      onProfilePictureUrlApplied: (url) => this.form.patchValue({ profilePicture: url }),
      onSuccess: (res) => this.user.set(res.data.user),
    });
  }
}

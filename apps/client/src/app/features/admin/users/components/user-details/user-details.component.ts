import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Mail, Shield, Calendar, Ticket } from 'lucide-angular';
import { UserDto } from '@events-app/shared-dtos';
import {
  AvatarComponent,
  BadgeComponent,
  RegisterCardComponent,
  RegistrationListComponent,
} from 'src/app/shared/components';
import { RouterLink } from '@angular/router';
import { NAV } from 'src/app/core';
import { RegistrationService } from 'src/app/core/services/registration.service';

const PREVIEW_LIMIT = 3;

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    LucideAngularModule,
    AvatarComponent,
    BadgeComponent,
    DatePipe,
    RegistrationListComponent,
    RouterLink,
  ],
  templateUrl: './user-details.component.html',
})
export default class UserDetailsComponent {
  user = input<UserDto | null>();

  readonly MailIcon = Mail;
  readonly ShieldIcon = Shield;
  readonly CalendarIcon = Calendar;
  readonly TicketIcon = Ticket;
  readonly nav = NAV;
  readonly previewLimit = PREVIEW_LIMIT;

  private readonly registrationService = inject(RegistrationService);

  private readonly userIdSignal = signal<string>('');

  readonly registrationsResource = this.registrationService.getUserRegistrations(() =>
    this.userIdSignal(),
  );

  readonly registrationsPreview = computed(() =>
    (this.registrationsResource.resource.value()?.data?.registrations ?? []).slice(
      0,
      PREVIEW_LIMIT,
    ),
  );

  readonly registrationsTotalCount = computed(
    () => this.registrationsResource.resource.value()?.data?.totalData ?? 0,
  );

  readonly extraRegistrationsCount = computed(() =>
    Math.max(0, this.registrationsTotalCount() - PREVIEW_LIMIT),
  );

  constructor() {
    effect(() => {
      this.userIdSignal.set(this.user()?._id ?? '');
    });
  }
}

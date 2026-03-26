import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, Ticket } from 'lucide-angular';
import { NAV } from 'src/app/core';
import {
  BackButtonComponent,
  PaginationComponent,
  SearchInputComponent,
  RegistrationListComponent,
} from 'src/app/shared/components';
import { UserDto } from '@events-app/shared-dtos';
import { RegistrationsFacade } from 'src/app/core/facades/registrations.facade';
import { isPopulated } from 'src/app/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-registrations',
  standalone: true,
  templateUrl: './user-registrations.component.html',
  imports: [
    LucideAngularModule,
    BackButtonComponent,
    SearchInputComponent,
    PaginationComponent,
    RegistrationListComponent,
  ],
})
export default class UserRegistrationsComponent {
  readonly TicketIcon = Ticket;
  readonly nav = NAV;

  private readonly route = inject(ActivatedRoute);
  private readonly snapshot = this.route.snapshot;
  private readonly registrationsFacade = inject(RegistrationsFacade);

  readonly userId = this.snapshot.paramMap.get('userId') ?? '';
  readonly user = signal<UserDto | null>(null);

  readonly registrationsResource = this.registrationsFacade.userRegistrationsResource(this.userId);

  constructor() {
    effect(() => {
      const registrations = this.registrationsResource.resource.value();
      if (this.userId) {
        if (registrations?.data?.registrations[0]?.user) {
          if (isPopulated<UserDto>(registrations?.data?.registrations[0]?.user)) {
            this.user.set(registrations?.data?.registrations[0]?.user);
          }
        }
      }
    });
  }

  handleSearch(search: string) {
    this.registrationsResource.setSearch(search);
  }
}

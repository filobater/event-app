import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, Ticket } from 'lucide-angular';
import { RegistrationsFacade } from 'src/app/core/facades/registrations.facade';
import {
  PaginationComponent,
  SearchInputComponent,
  RegistrationListComponent,
} from 'src/app/shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-my-registrations',
  standalone: true,
  templateUrl: './my-registrations.component.html',
  imports: [
    LucideAngularModule,
    SearchInputComponent,
    PaginationComponent,
    RegistrationListComponent,
  ],
})
export default class MyRegistrationsComponent {
  readonly TicketIcon = Ticket;

  private readonly registrationsFacade = inject(RegistrationsFacade);
  readonly registrationsResource = this.registrationsFacade.registrationsResource;

  handleSearch(search: string) {
    this.registrationsResource.setSearch(search);
  }
}

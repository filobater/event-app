import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, Ticket } from 'lucide-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-registrations-empty',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './registrations-empty.component.html',
})
export default class RegistrationsEmptyComponent {
  readonly TicketIcon = Ticket;
}

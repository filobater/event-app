import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import PrimaryButtonComponent from 'src/app/shared/components/buttons/primary-button/primary-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event-seats-payment-actions',
  standalone: true,
  imports: [CurrencyPipe, PrimaryButtonComponent],
  templateUrl: './event-seats-payment-actions.component.html',
})
export default class EventSeatsPaymentActionsComponent {
  totalAmount = input.required<number>();
  loading = input(false);

  pay = output<void>();
  cancelRegistration = output<void>();
}

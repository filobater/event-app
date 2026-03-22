import { Component, computed, input, output } from '@angular/core';
import { EventDto } from '@events-app/shared-dtos';
import AlertModalComponent from 'src/app/shared/components/alert-modal/alert-modal.component';
import { RequestStateClass } from 'src/app/core/request-state';

export type ModalAction = 'register' | 'pay' | 'cancel';

interface ModalConfig {
  title: string;
  description: string;
  cancelLabel: string;
  okLabel: string;
}

@Component({
  selector: 'app-event-seats-confirm-modal',
  standalone: true,
  imports: [AlertModalComponent],
  templateUrl: './event-seats-confirm-modal.component.html',
})
export class EventSeatsConfirmModalComponent {
  event = input.required<EventDto>();
  action = input<ModalAction | null>(null);
  seats = input<number>(1);
  totalPrice = input<number>(0);
  requestState = input<RequestStateClass>();

  ok = output<void>();
  cancelled = output<void>();

  private readonly formatCurrency = (amount: number) =>
    amount.toLocaleString('en-EG', { style: 'currency', currency: 'EGP' });

  readonly config = computed<ModalConfig | null>(() => {
    const action = this.action();
    if (!action) return null;

    switch (action) {
      case 'register':
        return {
          title: 'Confirm Registration',
          description:
            this.event().type === 'free'
              ? `You're about to register for "${this.event().title}" with ${this.seats()} seat(s), completely free.`
              : `You're about to reserve ${this.seats()} seat(s) for "${this.event().title}". Total: ${this.formatCurrency(this.totalPrice())}. Payment will be required to confirm your seat.`,
          cancelLabel: 'Go Back',
          okLabel: this.requestState()?.loading()
            ? 'Registering...'
            : this.event().type === 'free'
              ? 'Register for Free'
              : 'Reserve Seats',
        };

      case 'pay':
        return {
          title: 'Confirm Payment',
          description: `You're about to pay ${this.formatCurrency(this.event().price)} for your reservation of "${this.event().title}". This amount will be deducted from your balance.`,
          cancelLabel: 'Cancel',
          okLabel: this.requestState()?.loading() ? 'Paying...' : 'Proceed to Payment',
        };

      case 'cancel':
        return {
          title: 'Cancel Registration',
          description:
            this.event().type === 'paid' && this.event().isPaid
              ? `Are you sure you want to cancel your registration for "${this.event().title}"? Your payment of ${this.formatCurrency(this.event().price)} will be refunded to your balance.`
              : `Are you sure you want to cancel your registration for "${this.event().title}"? This action cannot be undone.`,
          cancelLabel: 'Keep Registration',
          okLabel: this.requestState()?.loading() ? 'Cancelling...' : 'Yes, Cancel',
        };
    }
  });
}

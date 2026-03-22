import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule, MinusIcon, PlusIcon, UsersIcon } from 'lucide-angular';
import { EventDto } from '@events-app/shared-dtos';
import ProgressComponent from 'src/app/shared/components/progress/progress.component';
import PrimaryButtonComponent from 'src/app/shared/components/buttons/primary-button/primary-button.component';
import {
  EventSeatsConfirmModalComponent,
  type ModalAction,
} from '../event-seats-confirm-modal/event-seats-confirm-modal.component';
import { RequestStateClass } from 'src/app/core/request-state';

@Component({
  selector: 'app-event-seats',
  standalone: true,
  imports: [
    CurrencyPipe,
    LucideAngularModule,
    ProgressComponent,
    PrimaryButtonComponent,
    EventSeatsConfirmModalComponent,
  ],
  templateUrl: './event-seats.component.html',
})
export default class EventSeatsComponent {
  event = input.required<EventDto>();
  requestState = input<RequestStateClass>();
  onRegistration = output<number>();
  onPayment = output<void>();
  onCancelRegistration = output<void>();

  readonly UsersIcon = UsersIcon;
  readonly MinusIcon = MinusIcon;
  readonly PlusIcon = PlusIcon;

  readonly seats = signal(1);
  readonly activeModal = signal<ModalAction | null>(null);

  readonly availableSeats = computed(() => this.event().totalSeats - this.event().registeredSeats);
  readonly isFull = computed(() => this.availableSeats() <= 0);
  readonly totalPrice = computed(() => this.event().price * this.seats());

  increment() {
    if (this.seats() < this.availableSeats()) {
      this.seats.update((s) => s + 1);
    }
  }

  decrement() {
    if (this.seats() > 1) {
      this.seats.update((s) => s - 1);
    }
  }

  openModal(action: ModalAction) {
    this.activeModal.set(action);
  }

  closeModal() {
    this.activeModal.set(null);
  }

  handleModalOk() {
    const action = this.activeModal();
    const actions: Record<ModalAction, () => void> = {
      register: () => this.onRegistration.emit(this.seats()),
      pay: () => this.onPayment.emit(),
      cancel: () => this.onCancelRegistration.emit(),
    };
    if (action) {
      actions[action]();
    }
  }
}

import { Component, computed, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule, MinusIcon, PlusIcon, UsersIcon } from 'lucide-angular';
import { EventDto } from '@events-app/shared-dtos';
import ProgressComponent from 'src/app/shared/components/progress/progress.component';
import PrimaryButtonComponent from 'src/app/shared/components/buttons/primary-button/primary-button.component';

@Component({
  selector: 'app-event-seats',
  standalone: true,
  imports: [CurrencyPipe, LucideAngularModule, ProgressComponent, PrimaryButtonComponent],
  templateUrl: './event-seats.component.html',
})
export default class EventSeatsComponent {
  event = input.required<EventDto>();

  readonly UsersIcon = UsersIcon;
  readonly MinusIcon = MinusIcon;
  readonly PlusIcon = PlusIcon;

  readonly seats = signal(1);

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
}


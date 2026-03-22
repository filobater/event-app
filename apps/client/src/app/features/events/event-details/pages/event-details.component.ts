import { Component, effect, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NAV } from 'src/app/core';
import { EventsFacade } from 'src/app/core/facades/events.facade';
import { BackButtonComponent, ErrorMessageComponent } from 'src/app/shared/components';
import {
  EventAboutComponent,
  EventDetailsSkeletonComponent,
  EventHeroComponent,
  EventSeatsComponent,
  EventSpeakersComponent,
} from '../components';
import { RegistrationsFacade } from 'src/app/core/facades/registrations.facade';

@Component({
  selector: 'app-event-details-page',
  standalone: true,
  imports: [
    LucideAngularModule,
    ErrorMessageComponent,
    BackButtonComponent,
    EventDetailsSkeletonComponent,
    EventHeroComponent,
    EventAboutComponent,
    EventSpeakersComponent,
    EventSeatsComponent,
  ],
  templateUrl: './event-details.component.html',
})
export default class EventDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly eventsFacade = inject(EventsFacade);
  readonly registrationsFacade = inject(RegistrationsFacade);

  readonly eventsPath = NAV.events;
  readonly eventId = this.route.snapshot.paramMap.get('id');

  private readonly seatsRef = viewChild<EventSeatsComponent>('seatsRef');

  constructor() {
    effect(() => {
      if (!this.eventId) {
        this.router.navigate([NAV.events]);
        return;
      }
      this.eventsFacade.loadEvent(this.eventId);
    });
  }

  handleRegistration(seatsCount: number) {
    if (this.eventId) {
      this.registrationsFacade.createRegistration(
        { event: this.eventId, seatsCount },
        (registration) => {
          this.seatsRef()?.closeModal();
          this.eventsFacade.event.update((event) =>
            event
              ? {
                  ...event,
                  registeredSeats: event.registeredSeats + seatsCount,
                  registration: registration._id,
                  isPaid: event.type === 'paid' ? false : true,
                }
              : null,
          );
        },
      );
    }
  }

  handlePayment() {
    const registrationId = this.eventsFacade.event()?.registration;
    if (registrationId) {
      this.registrationsFacade.payRegistration(registrationId, () => {
        this.seatsRef()?.closeModal();
        this.eventsFacade.event.update((event) => (event ? { ...event, isPaid: true } : null));
      });
    }
  }

  handleCancelRegistration() {
    const registrationId = this.eventsFacade.event()?.registration;
    if (registrationId) {
      this.registrationsFacade.cancelRegistration(registrationId, (registration) => {
        this.seatsRef()?.closeModal();
        this.eventsFacade.event.update((event) =>
          event
            ? {
                ...event,
                registration: '',
                isPaid: false,
                registeredSeats: event.registeredSeats - registration.seatsCount,
              }
            : null,
        );
      });
    }
  }
}

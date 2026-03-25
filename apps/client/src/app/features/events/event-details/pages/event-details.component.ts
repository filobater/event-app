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
import { CacheService } from 'src/app/core/services/cache.service';

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
  readonly cacheService = inject(CacheService);
  readonly cacheNamespace = 'events';

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
      this.registrationsFacade.createRegistration({ event: this.eventId, seatsCount }, () => {
        this.seatsRef()?.closeModal();
      });
    }
  }

  handlePayment() {
    const registrationId = this.eventsFacade.event()?.registration;
    if (registrationId) {
      this.registrationsFacade.payRegistration(registrationId, () => {
        this.seatsRef()?.closeModal();
      });
    }
  }

  handleCancelRegistration() {
    const registrationId = this.eventsFacade.event()?.registration;
    if (registrationId) {
      this.registrationsFacade.cancelRegistration(registrationId, () => {
        this.seatsRef()?.closeModal();
      });
    }
  }
}

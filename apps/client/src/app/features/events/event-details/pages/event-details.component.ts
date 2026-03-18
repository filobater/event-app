import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NAV } from 'src/app/core';
import { EventsFacade } from 'src/app/core/facades/events.facade';
import ErrorMessageComponent from 'src/app/shared/components/error-message/error-message.component';
import {
  EventAboutComponent,
  EventDetailsBackButtonComponent,
  EventDetailsSkeletonComponent,
  EventHeroComponent,
  EventSeatsComponent,
  EventSpeakersComponent,
} from '../components';

@Component({
  selector: 'app-event-details-page',
  standalone: true,
  imports: [
    LucideAngularModule,
    ErrorMessageComponent,
    EventDetailsBackButtonComponent,
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

  readonly eventsPath = NAV.events;
  readonly eventId = this.route.snapshot.paramMap.get('id');

  constructor() {
    effect(() => {
      if (!this.eventId) {
        this.router.navigate([NAV.events]);
        return;
      }
      this.eventsFacade.loadEvent(this.eventId);
    });
  }
}


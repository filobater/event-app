import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, TicketIcon } from 'lucide-angular';
import { EventsFacade } from 'src/app/core/facades/events.facade';
import { PaginationComponent, SearchInputComponent } from 'src/app/shared/components';
import {
  BrowseEventsFiltersComponent,
  EventCardSkeletonComponent,
  EventListComponent,
} from '../components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-browse-events',
  standalone: true,
  templateUrl: './browse-events.component.html',
  imports: [
    LucideAngularModule,
    SearchInputComponent,
    BrowseEventsFiltersComponent,
    EventListComponent,
    EventCardSkeletonComponent,
    PaginationComponent,
  ],
})
export default class BrowseEventsComponent {
  // icons
  readonly EventsIcon = TicketIcon;
  readonly skeletonItems = Array(6);

  private readonly eventsFacade = inject(EventsFacade);
  readonly eventsResource = this.eventsFacade.eventsResource;

  handleSearch(search: string) {
    this.eventsResource.setSearch(search);
  }
}

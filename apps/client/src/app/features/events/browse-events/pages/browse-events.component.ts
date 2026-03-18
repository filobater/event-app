import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, TicketIcon } from 'lucide-angular';
import { EventsFacade } from 'src/app/core/facades/events.facade';
import {
  BadgeComponent,
  PaginationComponent,
  SearchInputComponent,
} from 'src/app/shared/components';
import { EventCardSkeletonComponent, EventListComponent } from '../components';

@Component({
  selector: 'app-browse-events',
  standalone: true,
  templateUrl: './browse-events.component.html',
  imports: [
    LucideAngularModule,
    SearchInputComponent,
    EventListComponent,
    EventCardSkeletonComponent,
    BadgeComponent,
    PaginationComponent,
  ],
})
export default class BrowseEventsComponent {
  // icons
  readonly EventsIcon = TicketIcon;
  readonly skeletonItems = Array(6);

  private readonly eventsFacade = inject(EventsFacade);
  readonly eventsResource = this.eventsFacade.getAllEvents();

  readonly statusOptions = signal<{ label: string; value: string }[]>([
    { label: 'All', value: '' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
  ]);

  readonly categoryOptions = signal<{ label: string; value: string }[]>([
    { label: 'All', value: '' },
    { label: 'Technology', value: 'technology' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
  ]);

  getStatusColor(status: string): string {
    let defaultStatus = '';
    if (!status) {
      defaultStatus = 'all';
    }
    const activeColors: Record<string, string> = {
      [defaultStatus]: 'bg-(--secondary-color) text-(--dark-color)!',
      upcoming: 'bg-(--main-color) text-(--dark-color)!',
      ongoing: 'bg-(--accent-color) text-(--dark-color)!',
      completed: 'bg-(--gray-color) brightness-75',
    };

    const activeStatus = this.eventsResource.requestParams().status ?? '';
    const isActive = activeStatus === status;

    return isActive
      ? (activeColors[status] ?? activeColors[defaultStatus])
      : 'bg-(--gray-color) text-white/50';
  }

  getCategoryColor(category: string): string {
    const activeCategory = this.eventsResource.requestParams().category ?? '';
    const isActive = activeCategory === category;

    return isActive ? 'bg-(--main-color) text-(--dark-color)!' : 'bg-(--gray-color) text-white/50';
  }

  handleSearch(search: string) {
    this.eventsResource.setSearch(search);
  }

  handleStatusClick(status: string) {
    this.eventsResource.setStatus(status);
  }

  handleCategoryClick(category: string) {
    this.eventsResource.setCategory(category);
  }
}

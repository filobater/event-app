import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, TicketIcon } from 'lucide-angular';
import { EventsApiService } from 'src/app/core/services/events-api.service';
import {
  BadgeComponent,
  SearchInputComponent,
  PaginationComponent,
} from 'src/app/shared/components';
import EventListComponent from '../../ui/event-list/event-list.component';
import EventCardSkeletonComponent from '../../ui/event-card-skeleton/event-card-skeleton.component';

@Component({
  selector: 'app-public-events',
  standalone: true,
  templateUrl: './public-events.component.html',
  imports: [
    LucideAngularModule,
    SearchInputComponent,
    BadgeComponent,
    EventListComponent,
    EventCardSkeletonComponent,
    PaginationComponent,
  ],
})
export default class PublicEventsComponent {
  // icons
  readonly EventsIcon = TicketIcon;
  readonly skeletonItems = Array(6);

  private readonly eventsApiService = inject(EventsApiService);
  readonly eventsResource = this.eventsApiService.getAllEvents();

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
      completed: 'bg-(--gray-color) text-(--dark-color)!',
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
    if (this.eventsResource.resource.value()?.data?.events?.length === 0) return;
    this.eventsResource.setSearch(search);
  }

  handleStatusClick(status: string) {
    this.eventsResource.setStatus(status);
  }

  handleCategoryClick(category: string) {
    this.eventsResource.setCategory(category);
  }
}

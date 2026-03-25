import { Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventsFacade } from 'src/app/core/facades/events.facade';
import { BadgeComponent, SelectInputComponent } from 'src/app/shared/components';
import { STATUS_BADGE_COLORS } from 'src/app/shared/constants';

const ALL_SENTINEL = '__all__';

@Component({
  selector: 'app-browse-events-filters',
  standalone: true,
  templateUrl: './browse-events-filters.component.html',
  imports: [BadgeComponent, ReactiveFormsModule, SelectInputComponent],
})
export default class BrowseEventsFiltersComponent {
  private readonly eventsFacade = inject(EventsFacade);
  readonly eventsResource = this.eventsFacade.eventsResource;

  readonly statusOptions: { label: string; value: string }[] = [
    { label: 'All', value: '' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
  ];

  readonly categoryOptions: { label: string; value: string }[] = [
    { label: 'All', value: '' },
    { label: 'Technology', value: 'technology' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
  ];

  readonly statusSelectOptions = this.statusOptions.map((o) => ({
    label: o.label,
    value: o.value === '' ? ALL_SENTINEL : o.value,
  }));

  readonly categorySelectOptions = this.categoryOptions.map((o) => ({
    label: o.label,
    value: o.value === '' ? ALL_SENTINEL : o.value,
  }));

  readonly categoryControl = new FormControl<string>(ALL_SENTINEL, { nonNullable: true });
  readonly statusControl = new FormControl<string>(ALL_SENTINEL, { nonNullable: true });

  handleFiltersChange(item: 'category' | 'status') {
    const itemValue = this.eventsResource.requestParams()[item] ?? '';
    const next = itemValue === '' ? ALL_SENTINEL : itemValue;
    if (this[`${item}Control`].value !== next) {
      this[`${item}Control`].setValue(next, { emitEvent: false });
    }
  }

  constructor() {
    effect(() => {
      this.handleFiltersChange('category');
      this.handleFiltersChange('status');
    });

    this.categoryControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((v) => {
      this.eventsResource.setCategory(v === ALL_SENTINEL ? '' : v);
    });

    this.statusControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((v) => {
      this.eventsResource.setStatus(v === ALL_SENTINEL ? '' : v);
    });
  }

  getStatusColor(status: string): string {
    const allColor = 'bg-(--secondary-color) text-(--dark-color)!';
    const activeStatus = this.eventsResource.requestParams().status ?? '';
    const isActive = activeStatus === status;

    if (!isActive) return 'bg-(--gray-color) text-white/50';
    if (!status) return allColor;
    return STATUS_BADGE_COLORS[status] ?? allColor;
  }

  getCategoryColor(category: string): string {
    const activeCategory = this.eventsResource.requestParams().category ?? '';
    const isActive = activeCategory === category;

    return isActive ? 'bg-(--main-color) text-(--dark-color)!' : 'bg-(--gray-color) text-white/50';
  }

  handleStatusClick(status: string) {
    this.eventsResource.setStatus(status);
  }

  handleCategoryClick(category: string) {
    this.eventsResource.setCategory(category);
  }
}

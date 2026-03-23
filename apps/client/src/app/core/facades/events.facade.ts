import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { EventsApiService } from '../services/events-api.service';
import { CacheService } from '../services/cache.service';
import { RequestStateClass } from '../request-state';
import type {
  CreateEventRequestDto,
  EventDto,
  UpdateEventRequestDto,
} from '@events-app/shared-dtos';

@Injectable({ providedIn: 'root' })
export class EventsFacade {
  private readonly api = inject(EventsApiService);
  private readonly cache = inject(CacheService);
  private readonly injector = inject(Injector);
  private readonly cacheNamespace = 'events';

  private _eventsResource?: ReturnType<EventsApiService['getAllEvents']>;

  get eventsResource() {
    this._eventsResource ??= runInInjectionContext(this.injector, () => this.api.getAllEvents());
    return this._eventsResource;
  }

  readonly loadEventState = new RequestStateClass();
  readonly mutationState = new RequestStateClass();
  readonly event = signal<EventDto | null>(null);

  loadEvent(id: string | null): void {
    this.loadEventState.reset();

    if (!id) {
      this.event.set(null);
      return;
    }

    const cached = this.cache.get<EventDto>(this.cacheNamespace, id);
    if (cached) {
      this.event.set(cached);
      this.loadEventState.success();
      console.log('cached event', cached);
      return;
    }

    this.event.set(null);
    this.loadEventState.start();

    this.api.getEvent(id).subscribe({
      next: (res) => {
        this.loadEventState.success();
        this.cache.set(this.cacheNamespace, id, res.data.event);
        this.event.set(res.data.event);
      },
      error: (err) => this.loadEventState.fail(err),
    });
  }

  createEvent(data: CreateEventRequestDto, onSuccess?: (event: EventDto) => void): void {
    this.mutationState.start();
    this.api.createEvent(data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, res.data.event._id, res.data.event);
        this.eventsResource.addItem(res.data.event);
        onSuccess?.(res.data.event);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  updateEvent(
    id: string,
    data: UpdateEventRequestDto,
    onSuccess?: (event: EventDto) => void,
  ): void {
    this.mutationState.start();
    this.api.updateEvent(id, data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, id, res.data.event);
        this.eventsResource.updateItem(id, res.data.event);
        onSuccess?.(res.data.event);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  deleteEvent(id: string, onSuccess?: () => void): void {
    this.mutationState.start();
    this.api.deleteEvent(id).subscribe({
      next: () => {
        this.mutationState.success('Event deleted successfully');
        this.cache.delete(this.cacheNamespace, id);
        this.eventsResource.removeItem(id);
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}

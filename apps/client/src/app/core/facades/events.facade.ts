import { inject, Injectable, signal } from '@angular/core';
import { EventsApiService } from '../services/events-api.service';
import { RequestStateClass } from '../request-state';
import type { CreateEventRequestDto, EventDto, UpdateEventRequestDto } from '@events-app/shared-dtos';

@Injectable({
  providedIn: 'root',
})
export class EventsFacade {
  private readonly api = inject(EventsApiService);

  readonly loadEventState = new RequestStateClass();
  readonly event = signal<EventDto | null>(null);
  readonly mutationState = new RequestStateClass();

  getAllEvents() {
    return this.api.getAllEvents();
  }

  loadEvent(id: string | null): void {
    this.event.set(null);
    this.loadEventState.reset();
    if (!id) return;

    this.loadEventState.start();
    this.api.getEvent(id).subscribe({
      next: (res) => {
        this.loadEventState.success();
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
        onSuccess?.(res.data.event);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  updateEvent(id: string, data: UpdateEventRequestDto, onSuccess?: (event: EventDto) => void): void {
    this.mutationState.start();
    this.api.updateEvent(id, data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
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
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}

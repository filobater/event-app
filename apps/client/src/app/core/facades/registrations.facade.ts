import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { RegistrationService, CacheService } from 'src/app/core/services';
import { RequestStateClass } from 'src/app/core/request-state';
import type {
  CreateRegistrationRequestDto,
  EventDto,
  RegistrationDto,
} from '@events-app/shared-dtos';
import { EventsFacade } from './events.facade';

@Injectable({ providedIn: 'root' })
export class RegistrationsFacade {
  private readonly api = inject(RegistrationService);
  private readonly cache = inject(CacheService);
  private readonly injector = inject(Injector);
  private readonly cacheNamespace = 'registrations';
  private readonly cacheNamespaceEvent = 'events';
  private readonly eventsFacade = inject(EventsFacade);

  private _registrationsResource?: ReturnType<RegistrationService['getAllRegistrations']>;

  get registrationsResource() {
    this._registrationsResource ??= runInInjectionContext(this.injector, () =>
      this.api.getAllRegistrations(),
    );
    return this._registrationsResource;
  }

  readonly loadRegistrationState = new RequestStateClass();
  readonly mutationState = new RequestStateClass();
  readonly registration = signal<RegistrationDto | null>(null);

  readonly userRegistrationsResource = (userId: string) => this.api.getUserRegistrations(userId);

  updateEvent(event: EventDto): void {
    this.eventsFacade.event.update((oldEvent) => (oldEvent ? { ...oldEvent, ...event } : null));
    this.eventsFacade.eventsResource.updateItem(event._id, event);
    this.cache.set(this.cacheNamespaceEvent, event._id, event);
  }

  createRegistration(data: CreateRegistrationRequestDto, onSuccess?: () => void): void {
    this.mutationState.start();
    this.api.createRegistration(data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, res.data.registration._id, res.data.registration);
        this.updateEvent({
          ...this.eventsFacade.event()!,
          registeredSeats:
            (this.eventsFacade.event()?.registeredSeats ?? 0) + res.data.registration.seatsCount,
          registration: {
            _id: res.data.registration._id,
            seatsCount: res.data.registration.seatsCount,
            totalAmount: res.data.registration.totalAmount,
          },
          isPaid: this.eventsFacade.event()?.type === 'paid' ? false : true,
        });
        this.registrationsResource.addItem({
          ...res.data.registration,
          event: this.eventsFacade.event()!,
        });
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  payRegistration(id: string, onSuccess?: () => void): void {
    this.mutationState.start();
    this.api.payRegistration(id).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);

        this.updateEvent({
          ...this.eventsFacade.event()!,
          isPaid: true,
        });
        this.registrationsResource.updateItem(id, {
          ...res.data.registration,
          event: this.eventsFacade.event()!,
        });
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  cancelRegistration(id: string, onSuccess?: () => void): void {
    this.mutationState.start();
    this.api.cancelRegistration(id).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.updateEvent({
          ...this.eventsFacade.event()!,
          registration: {
            _id: '',
            seatsCount: 0,
            totalAmount: 0,
          },
          isPaid: false,
          registeredSeats:
            (this.eventsFacade.event()?.registeredSeats ?? 0) - res.data.registration.seatsCount,
        });
        this.registrationsResource.removeItem(id);

        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}

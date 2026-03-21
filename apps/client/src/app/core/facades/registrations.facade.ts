import { inject, Injectable, signal } from '@angular/core';
import { RegistrationService } from '../services/registration.service';
import { CacheService } from '../services/cache.service';
import { RequestStateClass } from '../request-state';
import type { CreateRegistrationRequestDto, RegistrationDto } from '@events-app/shared-dtos';

@Injectable({ providedIn: 'root' })
export class RegistrationsFacade {
  private readonly api = inject(RegistrationService);
  private readonly cache = inject(CacheService);
  private readonly cacheNamespace = 'registrations';

  //   readonly registrationsResource = this.api.getAllRegistrations;

  readonly loadRegistrationState = new RequestStateClass();
  readonly mutationState = new RequestStateClass();
  readonly registration = signal<RegistrationDto | null>(null);

  createRegistration(
    data: CreateRegistrationRequestDto,
    onSuccess?: (registration: RegistrationDto) => void,
  ): void {
    this.mutationState.start();
    this.api.createRegistration(data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, res.data.registration._id, res.data.registration);
        onSuccess?.(res.data.registration);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  payRegistration(id: string, onSuccess?: () => void): void {
    this.mutationState.start();
    this.api.payRegistration(id).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }

  cancelRegistration(id: string, onSuccess?: (registration: RegistrationDto) => void): void {
    this.mutationState.start();
    this.api.cancelRegistration(id).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        onSuccess?.(res.data.registration);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}

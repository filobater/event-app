import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { RegistrationService } from '../services/registration.service';
import { CacheService } from '../services/cache.service';
import { RequestStateClass } from '../request-state';
import type {
  CreateRegistrationRequestDto,
  RegistrationDto,
  UserDto,
} from '@events-app/shared-dtos';

@Injectable({ providedIn: 'root' })
export class RegistrationsFacade {
  private readonly api = inject(RegistrationService);
  private readonly cache = inject(CacheService);
  private readonly injector = inject(Injector);
  private readonly cacheNamespace = 'registrations';

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

  createRegistration(
    data: CreateRegistrationRequestDto,
    onSuccess?: (registration: RegistrationDto) => void,
  ): void {
    this.mutationState.start();
    this.api.createRegistration(data).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, res.data.registration._id, res.data.registration);
        this.registrationsResource.addItem(res.data.registration);
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
        this.registrationsResource.updateItem(id, res.data.registration);
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
        this.registrationsResource.updateItem(id, res.data.registration);
        onSuccess?.(res.data.registration);
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@events-app/endpoints';
import type {
  CreateRegistrationRequestDto,
  CreateRegistrationResponseDto,
  PayRegistrationResponseDto,
  CancelRegistrationResponseDto,
  RegistrationDto,
} from '@events-app/shared-dtos';
import { createPaginatedResource } from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly http = inject(HttpClient);
  private readonly baseRegistrationsUrl = `${environment.apiUrl}${API_ENDPOINTS.registrations.base}`;

  createRegistration(
    data: CreateRegistrationRequestDto,
  ): Observable<CreateRegistrationResponseDto> {
    return this.http.post<CreateRegistrationResponseDto>(
      `${this.baseRegistrationsUrl}${API_ENDPOINTS.registrations.create}`,
      data,
    );
  }

  // getAllRegistrations() {
  //   return createPaginatedResource<RegistrationDto, 'registrations'>(
  //     () => `${this.baseRegistrationsUrl}${API_ENDPOINTS.registrations.getAll}`,
  //     'registrations',
  //   );
  // }

  payRegistration(id: string): Observable<PayRegistrationResponseDto> {
    return this.http.patch<PayRegistrationResponseDto>(
      `${this.baseRegistrationsUrl}${API_ENDPOINTS.registrations.pay.replace(':id', id)}`,
      {},
    );
  }

  cancelRegistration(id: string): Observable<CancelRegistrationResponseDto> {
    return this.http.patch<CancelRegistrationResponseDto>(
      `${this.baseRegistrationsUrl}${API_ENDPOINTS.registrations.cancel.replace(':id', id)}`,
      {},
    );
  }
}

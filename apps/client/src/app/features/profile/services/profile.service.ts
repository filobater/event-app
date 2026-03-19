import { RequestStateClass } from 'src/app/core/request-state';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  UpdateUserPasswordRequestDto,
  UpdateUserProfileRequestDto,
  UserResponseDto,
  UpdateUserProfileResponseDto,
  UpdateUserPasswordResponseDto,
} from '@events-app/shared-dtos';
import { API_ENDPOINTS } from '@events-app/endpoints';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { toFormData } from 'src/app/shared/utils';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUsersUrl = `${environment.apiUrl}${API_ENDPOINTS.users.base}`;
  private readonly userService = inject(UserService);

  readonly updateProfileState = new RequestStateClass();
  readonly updatePasswordState = new RequestStateClass();

  getMe(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUsersUrl}${API_ENDPOINTS.users.getMe}`);
  }
  updateProfile(data: UpdateUserProfileRequestDto): Observable<UpdateUserProfileResponseDto> {
    const formData = toFormData(data);
    return this.http.patch<UpdateUserProfileResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.updateProfile}`,
      formData,
    );
  }

  updatePassword(data: UpdateUserPasswordRequestDto): Observable<UpdateUserPasswordResponseDto> {
    return this.http.patch<UpdateUserPasswordResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.updatePassword}`,
      data,
    );
  }
}

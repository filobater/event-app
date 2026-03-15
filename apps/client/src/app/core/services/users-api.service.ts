import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@events-app/endpoints';
import type {
  CreateUserRequestDto,
  UserResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
  UpdateUserProfileRequestDto,
  UpdateUserProfileResponseDto,
  UpdateUserPasswordRequestDto,
  UpdateUserPasswordResponseDto,
  DeleteUserResponseDto,
  UserDto,
} from '@events-app/shared-dtos';
import { createPaginatedResource } from 'src/app/shared/utils';

export interface GetAllUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUsersUrl = `${environment.apiUrl}${API_ENDPOINTS.users.base}`;

  // Admin actions

  createUser(data: CreateUserRequestDto): Observable<UserResponseDto> {
    const formData = this.toFormData(data);
    return this.http.post<UserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.create}`,
      formData,
    );
  }

  getAllUsers() {
    return createPaginatedResource<UserDto, 'users'>(
      () => `${this.baseUsersUrl}${API_ENDPOINTS.users.getAll}`,
      'users',
    );
  }

  getMe(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUsersUrl}${API_ENDPOINTS.users.getMe}`);
  }

  getUser(id: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId.replace(':id', id)}`,
    );
  }

  updateUser(id: string, data: UpdateUserRequestDto): Observable<UpdateUserResponseDto> {
    const formData = this.toFormData(data);
    return this.http.patch<UpdateUserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId.replace(':id', id)}`,
      formData,
    );
  }

  deleteUser(id: string): Observable<DeleteUserResponseDto> {
    return this.http.delete<DeleteUserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId.replace(':id', id)}`,
    );
  }

  // User actions

  updateProfile(data: UpdateUserProfileRequestDto): Observable<UpdateUserProfileResponseDto> {
    const formData = this.toFormData(data);
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

  //  Helpers

  private toFormData<T extends object>(data: T): FormData {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
    return formData;
  }
}

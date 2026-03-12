import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@events-app/endpoints';
import type {
  CreateUserRequestDto,
  GetAllUsersResponseDto,
  UserResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
  UpdateUserProfileRequestDto,
  UpdateUserProfileResponseDto,
  UpdateUserPasswordRequestDto,
  UpdateUserPasswordResponseDto,
  DeleteUserResponseDto,
} from '@events-app/shared-dtos';
import { createPaginatedResource, toHttpParams } from 'src/app/shared/utils';

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

  getAllUsers<GetAllUsersResponseDto>() {
    return createPaginatedResource<GetAllUsersResponseDto>(
      () => `${this.baseUsersUrl}${API_ENDPOINTS.users.getAll}`,
    );
  }

  getMe(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUsersUrl}${API_ENDPOINTS.users.getMe}`);
  }

  getUser(id: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUsersUrl}${API_ENDPOINTS.users.byId(id)}`);
  }

  updateUser(id: string, data: UpdateUserRequestDto): Observable<UpdateUserResponseDto> {
    const formData = this.toFormData(data);
    return this.http.patch<UpdateUserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId(id)}`,
      formData,
    );
  }

  deleteUser(id: string): Observable<DeleteUserResponseDto> {
    return this.http.delete<DeleteUserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId(id)}`,
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

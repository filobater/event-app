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
import { createPaginatedResource, toFormData } from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUsersUrl = `${environment.apiUrl}${API_ENDPOINTS.users.base}`;

  createUser(data: CreateUserRequestDto): Observable<UserResponseDto> {
    const formData = toFormData(data);
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

  getUser(id: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId.replace(':id', id)}`,
    );
  }

  updateUser(id: string, data: UpdateUserRequestDto): Observable<UpdateUserResponseDto> {
    const formData = toFormData(data);
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
}

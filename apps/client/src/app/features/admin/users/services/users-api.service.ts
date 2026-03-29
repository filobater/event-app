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
  DeleteUserResponseDto,
  UserDto,
} from '@events-app/shared-dtos';
import { createPaginatedResource } from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUsersUrl = `${environment.apiUrl}${API_ENDPOINTS.users.base}`;

  private removeEmptyFields(data: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(data).filter(([key, value]) =>
        key === 'profilePicture' ? true : !!value && !(value instanceof File),
      ),
    );
  }

  createUser(data: CreateUserRequestDto): Observable<UserResponseDto> {
    const dataToSend = this.removeEmptyFields(data);
    return this.http.post<UserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.create}`,
      dataToSend,
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
    return this.http.patch<UpdateUserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId.replace(':id', id)}`,
      this.removeEmptyFields(data),
    );
  }

  deleteUser(id: string): Observable<DeleteUserResponseDto> {
    return this.http.delete<DeleteUserResponseDto>(
      `${this.baseUsersUrl}${API_ENDPOINTS.users.byId.replace(':id', id)}`,
    );
  }
}

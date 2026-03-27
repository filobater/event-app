import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toFormData } from 'src/app/shared/utils';
import type {
  UploadKind,
  UploadMultipleResponseDto,
  UploadSingleResponseDto,
} from '@events-app/shared-dtos';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '@events-app/endpoints';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);
  private readonly baseUploadUrl = `${environment.apiUrl}${API_ENDPOINTS.upload.base}`;

  uploadSingle(file: File, type: UploadKind): Observable<UploadSingleResponseDto> {
    const data = toFormData({ file, type });
    return this.http.post<UploadSingleResponseDto>(
      `${this.baseUploadUrl}${API_ENDPOINTS.upload.single}${API_ENDPOINTS.upload.typeParam.replace(':type', type)}`,
      data,
    );
  }

  uploadMultiple(files: File[], type: UploadKind): Observable<UploadMultipleResponseDto> {
    const data = toFormData({ files, type });
    return this.http.post<UploadMultipleResponseDto>(
      `${this.baseUploadUrl}${API_ENDPOINTS.upload.multiple}${API_ENDPOINTS.upload.typeParam.replace(':type', type)}`,
      data,
    );
  }
}

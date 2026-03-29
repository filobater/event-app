import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  success(message: string, title?: string) {
    toast.success(message, {
      description: title,
    });
  }

  error(message: string, title?: string) {
    toast.error(message, {
      description: title,
    });
  }

  info(message: string) {
    toast.info(message);
  }

  warning(message: string) {
    toast.warning(message);
  }
  promise<T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((value: T) => string);
      error?: string | ((err: unknown) => string);
    },
  ): void {
    toast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error:
        options.error ??
        ((err: unknown) =>
          err instanceof HttpErrorResponse
            ? (err.error?.message ?? 'Request failed')
            : 'Something went wrong'),
    });
  }
}

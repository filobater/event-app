import { inject, signal } from '@angular/core';
import { ToastService } from 'src/app/core/services';
import { HttpErrorResponse } from '@angular/common/http';

export class RequestStateClass {
  loading = signal<boolean>(false);
  error = signal<string | string[] | null>(null);
  successMessage = signal<string | null>(null);
  private toastService = inject(ToastService);

  reset() {
    this.loading.set(false);
    this.error.set(null);
    this.successMessage.set(null);
  }

  start() {
    this.reset();
    this.loading.set(true);
  }

  success(successMessage?: string) {
    this.reset();

    if (successMessage && successMessage.trim() !== '') {
      this.successMessage.set(successMessage);
      this.toastService.success(successMessage);
    }
  }

  fail(err: HttpErrorResponse, options?: { differentToast?: boolean }) {
    this.reset();
    // this to handle the errors from zod validation
    if (err.error?.errors) {
      const formatted = Object.values(err.error.errors).flat() as string[];
      this.error.set(formatted);
      return;
    }
    this.error.set(err?.error?.message);
    if (!options?.differentToast) {
      this.toastService.error(err?.error?.message);
    }
  }
}

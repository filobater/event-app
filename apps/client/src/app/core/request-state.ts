import { signal } from '@angular/core';

export class RequestStateClass {
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  start() {
    this.loading.set(true);
    this.error.set(null);
    this.successMessage.set(null);
  }

  success(successMessage?: string) {
    this.loading.set(false);
    this.error.set(null);
    this.successMessage.set(successMessage ?? null);
  }

  fail(err: any) {
    this.error.set(err?.error?.message);
    this.loading.set(false);
    this.successMessage.set(null);
  }
}

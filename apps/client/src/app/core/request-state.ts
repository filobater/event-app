import { signal } from '@angular/core';

export class RequestStateClass<T> {
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  data = signal<T | null>(null);

  start() {
    this.loading.set(true);
    this.error.set(null);
    this.successMessage.set(null);
  }

  setData(data: T) {
    this.data.set(data);
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

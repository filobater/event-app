import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly classes = 'z-1000';
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
}

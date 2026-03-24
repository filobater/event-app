import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    @if (message() && typeof message() === 'string') {
      <p class="text-sm text-(--destructive-color) mt-1">{{ message() }}</p>
    }
    @if (message() && arrayMessage()) {
      <ul class="text-sm text-(--destructive-color) mt-1">
        @for (error of message(); track error) {
          <li class="list-disc! list-inside!">{{ error }}</li>
        }
      </ul>
    }
  `,
})
export default class ErrorMessageComponent {
  message = input<string | string[] | null | undefined>('');
  arrayMessage = computed(() => Array.isArray(this.message));
}

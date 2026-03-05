import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    @if (message()) {
      <p class="text-sm text-(--destructive-color) mt-1">{{ message() }}</p>
    }
  `,
})
export default class ErrorMessageComponent {
  message = input<string | null | undefined>('');
}

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress',
  template: `
    <progress class="progress w-full" [class]="color()" [value]="value()" [max]="max()"></progress>
  `,
})
export default class ProgressComponent {
  value = input<number>(0);
  max = input<number>(100);
  color = computed(() => {
    if (this.value() === this.max()) {
      return 'progress-error';
    } else if (this.value() < (this.max() * 0.75) && this.value() !== this.max()) {
      return 'progress-info';
    } else {
      return 'progress-warning';
    }
  });
}

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-event-info-label',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center gap-2 text-sm" [class]="textColor()">
      <span class="shrink-0 [&>svg]:size-4" aria-hidden="true">
        <ng-content />
      </span>
      <span>{{ title() }}</span>
    </div>
  `,
})
export default class EventInfoLabelComponent {
  title = input.required<string>();
  textColorClass = input<string>('');

  textColor = computed(() => {
    return this.textColorClass() ? this.textColorClass() : 'text-base-content/70';
  });
}

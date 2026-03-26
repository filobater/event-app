import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info-label',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center gap-2 text-sm" [class]="textColor()">
      <span class="shrink-0 [&>svg]:size-4" aria-hidden="true">
        <ng-content />
      </span>
      <span class="line-clamp-1">{{ title() }}</span>
    </div>
  `,
})
export default class InfoLabelComponent {
  title = input.required<string>();
  textColorClass = input<string>('');

  textColor = computed(() => {
    return this.textColorClass() ? this.textColorClass() : 'text-(--light-gray-color)';
  });
}

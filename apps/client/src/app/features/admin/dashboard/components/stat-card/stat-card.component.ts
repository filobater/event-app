import { Component, input } from '@angular/core';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div
      class="flex items-center gap-4 rounded-xl p-4 bg-(--dark-gray-color) border border-(--border-color)"
    >
      <div class="flex items-center justify-center size-10 rounded-xl bg-(--gray-color)">
        <i-lucide [img]="icon()" class="size-5" [class]="iconColor()" />
      </div>
      <div>
        <p class="text-2xl font-bold text-white">{{ value() }}</p>
        <p class="text-sm text-(--light-gray-color)">{{ label() }}</p>
      </div>
    </div>
  `,
})
export default class StatCardComponent {
  icon = input.required<LucideIconData>();
  value = input.required<string | number>();
  label = input.required<string>();
  iconColor = input<string>('text-(--main-color)');
}

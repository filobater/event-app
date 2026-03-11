import { Component, input, output, signal } from '@angular/core';
import { LucideAngularModule, ArrowUpDown } from 'lucide-angular';

@Component({
  selector: 'sort-button',
  template: `
    <button class="btn btn-sm btn-ghost" (click)="onSort()">
      {{ label() }}
      <i-lucide [img]="ArrowUpDownIcon" class="w-3 h-3" />
    </button>
  `,
  standalone: true,
  imports: [LucideAngularModule],
})
export default class SortButtonComponent {
  readonly ArrowUpDownIcon = ArrowUpDown;
  direction = signal<'asc' | 'desc' | null>('asc');
  label = input.required<string>();
  sort = output<{ label: string; direction: 'asc' | 'desc' | null }>();

  onSort() {
    this.direction.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    this.sort.emit({ label: this.label(), direction: this.direction() });
  }
}

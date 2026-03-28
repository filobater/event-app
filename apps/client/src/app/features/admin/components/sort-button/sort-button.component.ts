import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, ArrowUpDown } from 'lucide-angular';
import type { SortParams } from 'src/app/features/admin/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sort-button',
  template: `
    <button class="btn btn-sm btn-ghost" (click)="onSort()">
      {{ label() }}
      <i-lucide [img]="ArrowUpDownIcon" class="w-3 h-3" [class.text-blue-500]="isActive()" />
    </button>
  `,
  standalone: true,
  imports: [LucideAngularModule],
})
export default class SortButtonComponent {
  readonly ArrowUpDownIcon = ArrowUpDown;
  direction = signal<SortParams['direction']>(null);
  label = input.required<string>();
  value = input.required<string>();
  sort = output<SortParams>();

  route = inject(ActivatedRoute);
  queryParams = this.route.snapshot.queryParams;
  isActive = computed(() =>
    this.queryParams['sort']?.toString().toLowerCase().includes(this.value().toLowerCase()),
  );

  onSort() {
    if (!this.direction()) {
      this.direction.set('asc');
    } else {
      this.direction.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    }
    this.sort.emit({ label: this.label(), direction: this.direction() });
  }
}


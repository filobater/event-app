import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'sort-button',
  template: `
    <button class="btn btn-sm btn-ghost" (click)="onSort()">
      {{ label() }}

      <svg
        class="w-3 h-3"
        fill="currentColor"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M2 4H0l3-4 3 4H4v12H2V4zm12 8h2l-3 4-3-4h2V0h2v12z" fill-rule="evenodd"></path>
        </g>
      </svg>
    </button>
  `,
  standalone: true,
})
export default class SortButtonComponent {
  direction = signal<'asc' | 'desc' | null>('asc');
  label = input.required<string>();
  sort = output<{ label: string; direction: 'asc' | 'desc' | null }>();

  onSort() {
    this.direction.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    this.sort.emit({ label: this.label(), direction: this.direction() });
  }
}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span
    class="badge badge-md border-white/10 border text-sm rounded-full text-(--light-gray-color) capitalize transition-colors duration-300"
    [class.cursor-pointer]="clickable()"
    [class]="color()"
    tabindex="0"
    (click)="onClick.emit()"
  >
    <ng-content></ng-content> {{ label() }}
  </span>`,
})
export default class BadgeComponent {
  label = input.required<string>();
  color = input.required<string>();
  onClick = output<void>();
  clickable = input<boolean>(false);
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge badge-md rounded-full text-gray-400 capitalize" [class]="color()"
    ><ng-content></ng-content> {{ label() }}</span
  >`,
})
//TODO: EDIT THIS because this badge will also used for the category
export default class BadgeComponent {
  label = input.required<string>();
  color = input.required<string>();
}

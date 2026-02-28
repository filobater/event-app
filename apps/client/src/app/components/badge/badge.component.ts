import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span
    class="badge badge-md rounded-full text-gray-400 capitalize"
    [class]="variant[label()]"
    >{{ label() }}</span
  >`,
})
//TODO: EDIT THIS because this badge will also used for the category
export default class BadgeComponent {
  label = input.required<string>();
  variant: Record<string, string> = {
    ongoing: 'bg-(--accent-color)',
    upcoming: 'bg-(--main-color)',
    completed: 'bg-(--gray-color)',
  };
}

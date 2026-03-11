import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [],
  templateUrl: './secondary-button.component.html',
})
export default class SecondaryButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('');
  type = input<string>('button');

  handleClick = output<void>();
}

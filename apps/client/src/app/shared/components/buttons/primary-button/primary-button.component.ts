import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [],
  templateUrl: './primary-button.component.html',
})
export default class PrimaryButtonComponent {
  disabled = input<boolean>(false);
  label = input<string>('');
  type = input<string>('button');
  
  handleClick = output<void>();
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [],
  templateUrl: './primary-button.component.html',
})
export default class PrimaryButtonComponent {
  label = input<string>('');
  type = input<string>('button');
}

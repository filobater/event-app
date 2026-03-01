import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  templateUrl: './text-input.component.html',
})
export default class TextInputComponent {
  labelText = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('Type here');
}

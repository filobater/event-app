import { Component, input } from '@angular/core';

@Component({
  selector: 'app-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
})
export default class TextareaComponent {
  id = input<string>('');
  labelText = input<string>('');
  placeholder = input<string>('Type here');
}

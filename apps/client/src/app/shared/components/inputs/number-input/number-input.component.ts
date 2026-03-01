import { Component, input } from '@angular/core';

@Component({
  selector: 'app-number-input',
  standalone: true,
  templateUrl: './number-input.component.html',
})
export default class NumberInputComponent {
  private static idCounter = 0;
  readonly inputId = `number-input-${++NumberInputComponent.idCounter}`;

  id = input<string>('');
  labelText = input<string>('');
  placeholder = input<string>('0');
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input<number | string>(1);

  protected get resolvedId() {
    return this.id() || this.inputId;
  }
}

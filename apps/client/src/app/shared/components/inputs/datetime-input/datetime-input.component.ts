import { Component, input } from '@angular/core';

@Component({
  selector: 'app-datetime-input',
  standalone: true,
  templateUrl: './datetime-input.component.html',
})
export default class DatetimeInputComponent {
  labelText = input<string>('');
}

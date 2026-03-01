import { Component, input } from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  templateUrl: './search-input.component.html',
})
export default class SearchInputComponent {
  private static idCounter = 0;
  readonly inputId = `search-input-${++SearchInputComponent.idCounter}`;

  id = input<string>('');
  labelText = input<string>('');
  placeholder = input<string>('Search');

  protected get resolvedId() {
    return this.id() || this.inputId;
  }
}

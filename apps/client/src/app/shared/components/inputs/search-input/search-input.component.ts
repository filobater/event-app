import { Component, input } from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  templateUrl: './search-input.component.html',
})
export default class SearchInputComponent {
  placeholder = input<string>('Search');
}

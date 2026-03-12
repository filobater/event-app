import { Component, forwardRef, input, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-search-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
  imports: [LucideAngularModule],
  templateUrl: './search-input.component.html',
})
export default class SearchInputComponent {
  readonly SearchIcon = Search;
  placeholder = input<string>('Search');
  value = input<string>('');

  onSearch = output<string>();

  handleSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch.emit(value ?? '');
  }
  
}

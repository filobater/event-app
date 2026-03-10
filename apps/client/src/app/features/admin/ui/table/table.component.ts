import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-table',
  templateUrl: './table.component.html',
  imports: [CommonModule],
})
export default class TableComponent {
  rows = input.required<any[]>();
  columns = input.required<any[]>();

  sort(column: string) {
    // Add your sorting logic here
    // Example: toggle sort direction or sort rows array
    // This is a stub for now
    console.log('Sorting by:', column);
  }
}

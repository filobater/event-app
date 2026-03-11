import { Component, input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnDef<T> {
  label: string;
  key: keyof T;
  cellTemplate?: TemplateRef<{ $implicit: T }>;
  headerTemplate?: TemplateRef<unknown>;
}

export interface TableComponentInterface<T extends { _id: string }> {
  rows: T[];
  columns: ColumnDef<T>[];
}

@Component({
  selector: 'admin-table',
  templateUrl: './table.component.html',
  imports: [CommonModule],
})
export default class TableComponent<T extends { _id: string }> {
  tableConfiguration = input.required<TableComponentInterface<T>>();
}

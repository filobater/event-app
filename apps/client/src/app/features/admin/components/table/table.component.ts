import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from 'src/app/shared/components/';

export interface HeaderContext<T> {
  label: string;
  column: keyof T;
  sort: (params: { label: string; direction: 'asc' | 'desc' | null }) => void;
}

export interface ColumnDef<T> {
  label: string;
  key: keyof T;
  cellTemplate?: TemplateRef<{ $implicit: T }>;
  headerTemplate?: TemplateRef<HeaderContext<T>>;
}

export interface PaginationOptions {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableComponentInterface<T extends { _id: string }> {
  rows: T[];
  columns: ColumnDef<T>[];
  paginationOptions?: PaginationOptions;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-table',
  templateUrl: './table.component.html',
  imports: [CommonModule, PaginationComponent],
})
export default class TableComponent<T extends { _id: string }> {
  tableConfiguration = input.required<TableComponentInterface<T>>();
  sort = output<{ label: string; direction: 'asc' | 'desc' | null }>();
  paginationOptions = input<PaginationOptions>();
}


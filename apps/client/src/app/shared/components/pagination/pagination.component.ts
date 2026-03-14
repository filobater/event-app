import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
})
export default class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  pageChange = output<number>();

  protected get hasPrev(): boolean {
    return this.currentPage() > 1;
  }

  protected get hasNext(): boolean {
    return this.currentPage() < this.totalPages();
  }

  protected pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | 'ellipsis')[] = [];
    let l: number | undefined;
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }
    for (const i of range) {
      if (l !== undefined && i - l !== 1) {
        rangeWithDots.push('ellipsis');
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  });

  protected goTo(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageChange.emit(page);
  }

  protected next() {
    this.goTo(this.currentPage() + 1);
  }

  protected prev() {
    this.goTo(this.currentPage() - 1);
  }
}

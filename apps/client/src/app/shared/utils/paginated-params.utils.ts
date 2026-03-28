import { inject, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import type { SortParams } from 'src/app/features/admin/types';
export interface PaginatedParams {
  page?: number;
  search?: string;
  sort?: SortParams;
  status?: string;
  category?: string;
}

export function createPaginatedParams() {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  const queryParams = route.snapshot.queryParams;

  const page = signal<number>(Number(queryParams['page']) || 1);
  const sort = signal<string | null>(queryParams['sort'] || null);
  const searchInput = signal<string>(queryParams['search'] || '');
  const status = signal<string>(queryParams['status'] || '');
  const category = signal<string>(queryParams['category'] || '');
  const search$ = new Subject<string>();

  const debouncedSearch$ = toSignal(search$.pipe(debounceTime(300), distinctUntilChanged()), {
    initialValue: searchInput(),
  });

  const syncQueryParams = (params: Record<string, unknown>) => {
    router.navigate([], {
      queryParams: {
        ...queryParams,
        ...params,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  };

  const requestParams = computed(() => ({
    page: page(),
    search: debouncedSearch$() || undefined,
    sort: sort() || undefined,
    status: status() || undefined,
    category: category() || undefined,
  }));

  return {
    page,
    searchInput,
    sort,
    status,
    category,
    requestParams,

    goToPage: (target: number) => {
      page.set(target);
      syncQueryParams({ page: target });
    },

    setSearch: (term: string) => {
      searchInput.set(term);
      search$.next(term);
      page.set(1);
      syncQueryParams({ page: page(), search: term });
    },
    setSort: (params: SortParams) => {
      if (sort()?.includes('-') && params.direction === 'asc') {
        sort.set(params.label);
      } else {
        sort.set(`-${params.label}`);
      }
      page.set(1);
      syncQueryParams({ page: page(), sort: sort() });
    },
    setStatus: (value: string) => {
      status.set(value);
      syncQueryParams({ status: value });
    },
    setCategory: (value: string) => {
      category.set(value);
      syncQueryParams({ category: value });
    },
  };
}

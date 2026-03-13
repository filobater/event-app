import { inject, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export interface SortParams {
  label: string;
  direction: 'asc' | 'desc' | null;
}

export interface PaginatedParams {
  page?: number;
  search?: string;
  sort?: SortParams;
}

export function createPaginatedParams() {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  const queryParams = route.snapshot.queryParams;

  const page = signal<number>(Number(queryParams['page']) || 1);
  const sort = signal<string | null>(queryParams['sort'] || null);
  const searchInput = signal<string>(queryParams['search'] || '');

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
  }));

  return {
    page,
    searchInput,
    sort,
    requestParams,

    nextPage: () => {
      page.update((p) => p + 1);
      syncQueryParams({ page: page() });
    },
    prevPage: () => {
      page.update((p) => (p > 1 ? p - 1 : 1));
      syncQueryParams({ page: page() });
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
  };
}

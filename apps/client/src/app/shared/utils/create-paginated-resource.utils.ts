import { inject, signal } from '@angular/core';

import { toHttpParams } from './http.utils';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

export interface SortParams {
  label: string;
  direction: 'asc' | 'desc' | null;
}

export interface PaginatedParams {
  page?: number;
  search?: string;
  sort?: SortParams;
}

export interface PaginatedResourceConfig {
  url: string;
  params?: PaginatedParams;
}

export function createPaginatedResource<T>(url: () => string) {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  const queryParams = route.snapshot.queryParams;

  const page = signal<number>(Number(queryParams['page']) || 1);
  const sort = signal<string>(queryParams['sort'] || null);
  const searchInput = signal<string>(queryParams['search'] || '');

  //   this handling the debounced search and the idea is behind it that we listen in .next(value) it triggers the time time restart on every time we type a letter and if the user stop typing for 300ms we emit the value and if the value is the same as the previous value we don't emit the value

  const search$ = new Subject<string>();
  const debouncedSearch$ = toSignal(search$.pipe(debounceTime(300), distinctUntilChanged()), {
    initialValue: searchInput(),
  });

  const syncQueryParams = (params: Record<string, any>) => {
    router.navigate([], {
      queryParams: {
        ...queryParams,
        ...params,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  };

  const resource = httpResource<T>(() => ({
    url: url(),
    method: 'GET',
    cache: 'force-cache',
    params: toHttpParams({
      page: page(),
      search: debouncedSearch$() || undefined,
      sort: sort() || undefined,
    }),
  }));

  return {
    resource,

    page,
    searchInput,
    sort,

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
      search$.next(term); // here the emit value that the search subject listens to
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

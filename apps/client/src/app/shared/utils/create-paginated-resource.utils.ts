import { httpResource } from '@angular/common/http';

import { toHttpParams } from './http.utils';
import {
  createPaginatedParams,
  type PaginatedParams,
  type SortParams,
} from './paginated-params.utils';

export type { SortParams, PaginatedParams };

export interface PaginatedResourceConfig {
  url: string;
  params?: PaginatedParams;
}

export function createPaginatedResource<T>(url: () => string) {
  const params = createPaginatedParams();

  const resource = httpResource<T>(() => ({
    url: url(),
    method: 'GET',
    params: toHttpParams(params.requestParams()),
  }));

  return {
    resource,

    ...params,
  };
}

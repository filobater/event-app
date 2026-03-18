import { httpResource } from '@angular/common/http';
import { PaginatedResponseDto } from '@events-app/shared-dtos';

import { toHttpParams } from './http.utils';
import { createPaginatedParams, type PaginatedParams } from './paginated-params.utils';
import { createPaginatedMutations } from './paginated-mutations.utils';

export interface PaginatedResourceConfig {
  url: string;
  params?: PaginatedParams;
}

export function createPaginatedResource<Item extends { _id: string }, Key extends string>(
  url: () => string,
  dataKey: Key,
) {
  const params = createPaginatedParams();

  const resource = httpResource<PaginatedResponseDto<Record<Key, Item[]>>>(() => ({
    url: url(),
    method: 'GET',
    params: toHttpParams(params.requestParams()),
  }));

  const mutations = createPaginatedMutations<Item, Key>(resource, dataKey);

  return {
    resource,
    ...mutations,
    ...params,
  };
}

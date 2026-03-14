import { HttpResourceRef } from '@angular/common/http';
import { PaginatedResponseDto } from '@events-app/shared-dtos';

export function createPaginatedMutations<Item extends { _id: string }, Key extends string>(
  resource: HttpResourceRef<PaginatedResponseDto<Record<Key, Item[]>> | undefined>,
  dataKey: Key,
) {
  const getCurrent = () => resource.value();

  const getItems = (): Item[] => getCurrent()?.data?.[dataKey] ?? [];

  return {
    removeItem: (id: string) => {
      const current = getCurrent();
      if (!current) return;

      resource.set({
        ...current,
        data: {
          ...current.data,
          [dataKey]: getItems().filter((item) => item._id !== id),
          totalData: current.data.totalData - 1,
          count: current.data.count - 1,
        },
      });
    },

    addItem: (item: Item) => {
      const current = getCurrent();
      if (!current) return;

      resource.set({
        ...current,
        data: {
          ...current.data,
          [dataKey]: [item, ...getItems()],
          totalData: current.data.totalData + 1,
          count: current.data.count + 1,
        },
      });
    },

    updateItem: (id: string, updated: Partial<Item>) => {
      const current = getCurrent();
      if (!current) return;

      resource.set({
        ...current,
        data: {
          ...current.data,
          [dataKey]: getItems().map((item: Item) =>
            item._id === id ? { ...item, ...updated } : item,
          ),
        },
      });
    },
  };
}

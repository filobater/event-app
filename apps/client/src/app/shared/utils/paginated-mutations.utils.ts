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
          ...(current.data.count >= 1 && { count: current.data.count - 1 }),
          ...(current.data.count === 1 && { totalPages: current.data.totalPages - 1 }),
          totalData: current.data.totalData > 0 ? current.data.totalData - 1 : 0,
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
          ...(current.data.count < 10 && { count: current.data.count + 1 }),
          ...(current.data.count === 10 && { totalPages: current.data.totalPages + 1 }),
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

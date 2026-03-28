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

      const newCount = current.data.count - 1;

      resource.set({
        ...current,
        data: {
          ...current.data,
          [dataKey]: getItems().filter((item) => item._id !== id),
          count: Math.max(0, newCount),
          totalData: Math.max(0, current.data.totalData - 1),
          totalPages:
            newCount === 0 && current.data.totalPages > 1
              ? current.data.totalPages - 1
              : current.data.totalPages,
        },
      });
    },

    addItem: (item: Item) => {
      const current = getCurrent();
      if (!current) return;

      const pageSize = 10;
      const currentItems = getItems();
      const newCount = current.data.count + 1;
      const overPageLimit = newCount > pageSize;

      resource.set({
        ...current,
        data: {
          ...current.data,
          [dataKey]: [item, ...currentItems].slice(0, pageSize),
          count: Math.min(newCount, pageSize),
          totalData: current.data.totalData + 1,
          totalPages: overPageLimit ? current.data.totalPages + 1 : current.data.totalPages,
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

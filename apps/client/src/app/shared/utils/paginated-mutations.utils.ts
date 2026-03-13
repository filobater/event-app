import { WritableResource } from '@angular/core';
import { PaginatedResponseDto } from '@events-app/shared-dtos';

export function createPaginatedMutations<Item extends { id: string }>(
  resource: WritableResource<PaginatedResponseDto<{ items: Item[] }> | undefined>,
) {
  const getCurrent = () => resource.value();

  return {
    removeItem: (id: string) => {
      const current = getCurrent();
      if (!current) return;

      resource.set({
        ...current,
        data: {
          ...current.data,
          items: current.data.items.filter((item: Item) => item.id !== id),
          totalData: current.data.totalData - 1,
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
          items: [item, ...current.data.items],
          totalData: current.data.totalData + 1,
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
          items: current.data.items?.map((item: Item) =>
            item.id === id ? { ...item, ...updated } : item,
          ),
        },
      });
    },
  };
}

export function toFormData<T extends Record<string, unknown>>(data: T): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (!value && typeof value !== 'number') continue;

    if (value instanceof File) {
      formData.append(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (!item) continue;
        formData.append(key, item as any);
      }
      continue;
    }

    formData.append(key, String(value));
  }

  return formData;
}

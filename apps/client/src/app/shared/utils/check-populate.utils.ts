export function isPopulated<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined && typeof value !== 'string';
}

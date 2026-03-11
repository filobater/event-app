import { HttpParams } from '@angular/common/http';

export function toHttpParams(obj: Record<string, any>): HttpParams {
  const clean = Object.entries(obj).filter(([, value]) => !!value);
  return new HttpParams({ fromObject: Object.fromEntries(clean) });
}

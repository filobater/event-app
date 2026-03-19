import { Injectable } from '@angular/core';

type Namespace = string;
type Id = string;

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly store = new Map<Namespace, Map<Id, CacheItem<unknown>>>();
  private readonly defaultExpiration = 15 * 60 * 1000; // 15 minutes

  get<T>(namespace: Namespace, id: Id): T | undefined {
    const entry = this.store.get(namespace)?.get(id) as CacheItem<T> | undefined;
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.delete(namespace, id);
      return undefined;
    }

    return entry.value;
  }

  set<T>(namespace: Namespace, id: Id, value: T, ttl = this.defaultExpiration): void {
    let bucket = this.store.get(namespace);
    if (!bucket) {
      bucket = new Map<Id, CacheItem<unknown>>();
      this.store.set(namespace, bucket);
    }
    bucket.set(id, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  delete(namespace: Namespace, id: Id): void {
    this.store.get(namespace)?.delete(id);
  }

  clear(namespace?: Namespace): void {
    if (!namespace) {
      this.store.clear();
      return;
    }
    this.store.delete(namespace);
  }
}

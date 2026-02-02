type CacheEntry = {
  data: unknown;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30000;

function getCacheKey(collection: string, query?: Record<string, string>): string {
  const queryStr = query ? JSON.stringify(query) : '';
  return `${collection}:${queryStr}`;
}

export function clearCache(collection?: string): void {
  if (collection) {
    for (const key of cache.keys()) {
      if (key.startsWith(`${collection}:`)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

export async function getCollection<T>(
  collection: string,
  query?: Record<string, string>
): Promise<{ items: T[]; total: number }> {
  const cacheKey = getCacheKey(collection, query);
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as { items: T[]; total: number };
  }
  
  const params = new URLSearchParams(query || {});
  const url = `/api/collections/${collection}${params.toString() ? `?${params}` : ''}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  
  const data = await res.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}

export async function getRecord<T>(collection: string, id: string): Promise<T | null> {
  const res = await fetch(`/api/collections/${collection}/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createRecord<T>(collection: string, data: Partial<T>): Promise<T> {
  const res = await fetch(`/api/collections/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Failed to create');
  clearCache(collection);
  return res.json();
}

export async function updateRecord<T>(collection: string, id: string, data: Partial<T>): Promise<T> {
  const res = await fetch(`/api/collections/${collection}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Failed to update');
  clearCache(collection);
  return res.json();
}

export async function deleteRecord(collection: string, id: string): Promise<boolean> {
  const res = await fetch(`/api/collections/${collection}/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) return false;
  clearCache(collection);
  return true;
}

export async function initDemoData(): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/admin/seed', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to initialize');
  clearCache();
  return res.json();
}

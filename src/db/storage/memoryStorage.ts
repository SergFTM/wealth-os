import { StorageAdapter, BaseRecord, QueryOptions, AuditEvent } from './storage.types';

const store = new Map<string, unknown[]>();

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function matchesQuery<T extends BaseRecord>(item: T, query?: QueryOptions): boolean {
  if (!query) return true;
  
  if (query.search) {
    const search = query.search.toLowerCase();
    const values = Object.values(item).map(v => String(v).toLowerCase());
    if (!values.some(v => v.includes(search))) return false;
  }
  
  if (query.status && (item as Record<string, unknown>).status !== query.status) return false;
  if (query.clientId && (item as Record<string, unknown>).clientId !== query.clientId) return false;
  if (query.entityId && (item as Record<string, unknown>).entityId !== query.entityId) return false;
  
  return true;
}

export const memoryStorage: StorageAdapter = {
  async list<T extends BaseRecord>(collection: string, query?: QueryOptions): Promise<T[]> {
    const data = (store.get(collection) || []) as T[];
    let filtered = data.filter(item => matchesQuery(item, query));
    
    if (query?.sortBy) {
      filtered.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[query.sortBy!];
        const bVal = (b as Record<string, unknown>)[query.sortBy!];
        const cmp = String(aVal).localeCompare(String(bVal));
        return query.sortOrder === 'desc' ? -cmp : cmp;
      });
    }
    
    if (query?.offset) filtered = filtered.slice(query.offset);
    if (query?.limit) filtered = filtered.slice(0, query.limit);
    
    return filtered;
  },

  async get<T extends BaseRecord>(collection: string, id: string): Promise<T | null> {
    const data = (store.get(collection) || []) as T[];
    return data.find(item => item.id === id) || null;
  },

  async create<T extends BaseRecord>(collection: string, record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const data = (store.get(collection) || []) as T[];
    const now = new Date().toISOString();
    const newRecord = { ...record, id: generateId(), createdAt: now, updatedAt: now } as T;
    data.push(newRecord);
    store.set(collection, data);
    return newRecord;
  },

  async update<T extends BaseRecord>(collection: string, id: string, patch: Partial<T>): Promise<T | null> {
    const data = (store.get(collection) || []) as T[];
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    const updated = { ...data[index], ...patch, updatedAt: new Date().toISOString() };
    data[index] = updated;
    store.set(collection, data);
    return updated;
  },

  async remove(collection: string, id: string): Promise<boolean> {
    const data = (store.get(collection) || []) as BaseRecord[];
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return false;
    data.splice(index, 1);
    store.set(collection, data);
    return true;
  },

  async appendAudit(event: Omit<AuditEvent, 'id' | 'ts'>): Promise<AuditEvent> {
    const data = (store.get('auditEvents') || []) as AuditEvent[];
    const newEvent: AuditEvent = { ...event, id: generateId(), ts: new Date().toISOString() };
    data.push(newEvent);
    store.set('auditEvents', data);
    return newEvent;
  },

  async getAuditEvents(recordId: string): Promise<AuditEvent[]> {
    const data = (store.get('auditEvents') || []) as AuditEvent[];
    return data.filter(e => e.recordId === recordId).sort((a, b) => 
      new Date(b.ts).getTime() - new Date(a.ts).getTime()
    );
  },

  async count(collection: string, query?: QueryOptions): Promise<number> {
    const data = (store.get(collection) || []) as BaseRecord[];
    return data.filter(item => matchesQuery(item, query)).length;
  },
};

export function clearMemoryStorage() {
  store.clear();
}

export function seedMemoryStorage(data: Record<string, unknown[]>) {
  for (const [collection, records] of Object.entries(data)) {
    store.set(collection, records);
  }
}

import { promises as fs } from 'fs';
import path from 'path';
import { StorageAdapter, BaseRecord, QueryOptions, AuditEvent } from './storage.types';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

const locks = new Map<string, Promise<void>>();

async function withLock<T>(collection: string, fn: () => Promise<T>): Promise<T> {
  const key = collection;
  while (locks.has(key)) {
    await locks.get(key);
  }
  let resolve: () => void;
  const lock = new Promise<void>((r) => { resolve = r; });
  locks.set(key, lock);
  try {
    return await fn();
  } finally {
    locks.delete(key);
    resolve!();
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function readCollection<T>(collection: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  const tempPath = `${filePath}.tmp`;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
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
  if (query.portfolioId && (item as Record<string, unknown>).portfolioId !== query.portfolioId) return false;
  if (query.accountId && (item as Record<string, unknown>).accountId !== query.accountId) return false;
  
  return true;
}

export const fileStorage: StorageAdapter = {
  async list<T extends BaseRecord>(collection: string, query?: QueryOptions): Promise<T[]> {
    const data = await readCollection<T>(collection);
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
    const data = await readCollection<T>(collection);
    return data.find(item => item.id === id) || null;
  },

  async create<T extends BaseRecord>(collection: string, record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return withLock(collection, async () => {
      const data = await readCollection<T>(collection);
      const now = new Date().toISOString();
      const newRecord = {
        ...record,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      } as T;
      data.push(newRecord);
      await writeCollection(collection, data);
      return newRecord;
    });
  },

  async update<T extends BaseRecord>(collection: string, id: string, patch: Partial<T>): Promise<T | null> {
    return withLock(collection, async () => {
      const data = await readCollection<T>(collection);
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;
      
      const updated = {
        ...data[index],
        ...patch,
        id: data[index].id,
        createdAt: data[index].createdAt,
        updatedAt: new Date().toISOString(),
      };
      data[index] = updated;
      await writeCollection(collection, data);
      return updated;
    });
  },

  async remove(collection: string, id: string): Promise<boolean> {
    return withLock(collection, async () => {
      const data = await readCollection<BaseRecord>(collection);
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return false;
      data.splice(index, 1);
      await writeCollection(collection, data);
      return true;
    });
  },

  async appendAudit(event: Omit<AuditEvent, 'id' | 'ts'>): Promise<AuditEvent> {
    return withLock('auditEvents', async () => {
      const data = await readCollection<AuditEvent>('auditEvents');
      const newEvent: AuditEvent = {
        ...event,
        id: generateId(),
        ts: new Date().toISOString(),
      };
      data.push(newEvent);
      await writeCollection('auditEvents', data);
      return newEvent;
    });
  },

  async getAuditEvents(recordId: string): Promise<AuditEvent[]> {
    const data = await readCollection<AuditEvent>('auditEvents');
    return data.filter(e => e.recordId === recordId).sort((a, b) => 
      new Date(b.ts).getTime() - new Date(a.ts).getTime()
    );
  },

  async count(collection: string, query?: QueryOptions): Promise<number> {
    const data = await readCollection<BaseRecord>(collection);
    return data.filter(item => matchesQuery(item, query)).length;
  },
};

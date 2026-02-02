import { promises as fs } from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var __WEALTH_OS_SEEDED__: boolean | undefined;
  // eslint-disable-next-line no-var
  var __WEALTH_OS_SEEDING__: Promise<void> | undefined;
}

const DATA_DIR = path.join(process.cwd(), 'src/db/data');
const SEED_FILE = path.join(process.cwd(), 'src/db/seed/seed.json');

async function checkDataExists(): Promise<boolean> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    if (jsonFiles.length === 0) return false;
    
    const clientsPath = path.join(DATA_DIR, 'clients.json');
    const content = await fs.readFile(clientsPath, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

async function performSeed(): Promise<void> {
  try {
    const seedContent = await fs.readFile(SEED_FILE, 'utf-8');
    const seedData = JSON.parse(seedContent);
    
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    for (const [collection, records] of Object.entries(seedData)) {
      const filePath = path.join(DATA_DIR, `${collection}.json`);
      await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
    }
    
    console.log('[FileDB] Seed completed');
  } catch (error) {
    console.error('[FileDB] Seed failed:', error);
  }
}

export async function ensureSeedOnce(force = false): Promise<void> {
  if (globalThis.__WEALTH_OS_SEEDED__ && !force) {
    return;
  }
  
  if (globalThis.__WEALTH_OS_SEEDING__) {
    await globalThis.__WEALTH_OS_SEEDING__;
    return;
  }
  
  const hasData = await checkDataExists();
  if (hasData && !force) {
    globalThis.__WEALTH_OS_SEEDED__ = true;
    return;
  }
  
  globalThis.__WEALTH_OS_SEEDING__ = performSeed();
  await globalThis.__WEALTH_OS_SEEDING__;
  globalThis.__WEALTH_OS_SEEDED__ = true;
  globalThis.__WEALTH_OS_SEEDING__ = undefined;
}

export function resetSeedFlag(): void {
  globalThis.__WEALTH_OS_SEEDED__ = false;
}

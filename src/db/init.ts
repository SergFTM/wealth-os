import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');
const SEED_FILE = path.join(process.cwd(), 'src/db/seed/seed.json');

export async function initDatabase() {
  try {
    await fs.access(DATA_DIR);
    const files = await fs.readdir(DATA_DIR);
    const hasData = files.some(f => f.endsWith('.json'));
    
    if (!hasData) {
      await seedFromFile();
    }
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await seedFromFile();
  }
}

async function seedFromFile() {
  try {
    const seedData = await fs.readFile(SEED_FILE, 'utf-8');
    const data = JSON.parse(seedData);
    
    for (const [collection, records] of Object.entries(data)) {
      const filePath = path.join(DATA_DIR, `${collection}.json`);
      await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

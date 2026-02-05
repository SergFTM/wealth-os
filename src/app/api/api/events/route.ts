import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'db', 'data');

async function loadCollection<T>(name: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_PATH, `${name}.json`);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T[];
  } catch {
    return [];
  }
}

async function saveCollection<T>(name: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_PATH, `${name}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const webhookId = searchParams.get('webhookId');

    let deliveries = await loadCollection<Record<string, unknown>>('webhookDeliveries');

    if (status) {
      deliveries = deliveries.filter((d) => d.status === status);
    }
    if (webhookId) {
      deliveries = deliveries.filter((d) => d.webhookId === webhookId);
    }

    // Sort by createdAt descending
    deliveries.sort((a, b) =>
      new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error('Error loading deliveries:', error);
    return NextResponse.json({ error: 'Failed to load deliveries' }, { status: 500 });
  }
}

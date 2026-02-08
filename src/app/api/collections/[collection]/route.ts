import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage/getStorage';
import { ensureSeedOnce } from '@/db/storage/ensureSeed';
import { ALL_COLLECTIONS, Collection } from '@/db/storage/storage.types';

const VALID_COLLECTIONS: ReadonlySet<string> = new Set(ALL_COLLECTIONS);

type RouteParams = Promise<{ collection: string }>;

export async function GET(request: NextRequest, { params }: { params: RouteParams }) {
  const { collection } = await params;
  
  if (!VALID_COLLECTIONS.has(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const { searchParams } = new URL(request.url);
  const query = {
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    clientId: searchParams.get('clientId') || undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  };

  const items = await storage.list(collection, query);
  const total = await storage.count(collection, query);

  return NextResponse.json({ items, total });
}

export async function POST(request: NextRequest, { params }: { params: RouteParams }) {
  const { collection } = await params;
  
  if (!VALID_COLLECTIONS.has(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const body = await request.json();
  const record = await storage.create(collection, body);
  
  await storage.appendAudit({
    actorRole: 'admin',
    actorName: 'System',
    action: 'create',
    collection,
    recordId: record.id,
    summary: `Created ${collection} record`,
  });

  return NextResponse.json(record, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage/getStorage';
import { ensureSeedOnce } from '@/db/storage/ensureSeed';
import { Collection } from '@/db/storage/storage.types';

const VALID_COLLECTIONS: Collection[] = [
  'clients', 'entities', 'portfolios', 'accounts', 'documents',
  'tasks', 'approvals', 'breaches', 'alerts', 'invoices',
  'payments', 'syncJobs', 'threads', 'messages', 'connections', 'auditEvents'
];

type RouteParams = Promise<{ collection: string; id: string }>;

export async function GET(_request: NextRequest, { params }: { params: RouteParams }) {
  const { collection, id } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const record = await storage.get(collection, id);
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PATCH(request: NextRequest, { params }: { params: RouteParams }) {
  const { collection, id } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const body = await request.json();
  const record = await storage.update(collection, id, body);
  
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await storage.appendAudit({
    actorRole: 'admin',
    actorName: 'System',
    action: 'update',
    collection,
    recordId: id,
    summary: `Updated ${collection} record`,
  });

  return NextResponse.json(record);
}

export async function DELETE(_request: NextRequest, { params }: { params: RouteParams }) {
  const { collection, id } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const deleted = await storage.remove(collection, id);
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await storage.appendAudit({
    actorRole: 'admin',
    actorName: 'System',
    action: 'delete',
    collection,
    recordId: id,
    summary: `Deleted ${collection} record`,
  });

  return NextResponse.json({ success: true });
}

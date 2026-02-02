import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage/getStorage';
import { ensureSeedOnce } from '@/db/storage/ensureSeed';

type RouteParams = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: RouteParams }) {
  const { id } = await params;

  await ensureSeedOnce();
  const storage = getStorage();

  const events = await storage.getAuditEvents(id);
  return NextResponse.json({ events });
}

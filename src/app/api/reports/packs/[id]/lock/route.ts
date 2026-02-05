import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

interface ReportPack {
  id: string;
  status: string;
  lockedAt?: string;
  lockedBy?: string;
  updatedAt: string;
  [key: string]: unknown;
}

async function readPacks(): Promise<ReportPack[]> {
  try {
    const filePath = path.join(DATA_DIR, 'reportPacks.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writePacks(packs: ReportPack[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'reportPacks.json');
  await fs.writeFile(filePath, JSON.stringify(packs, null, 2));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packs = await readPacks();
    const index = packs.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const pack = packs[index];

    if (pack.status !== 'draft') {
      return NextResponse.json(
        { error: `Cannot lock pack with status: ${pack.status}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    pack.status = 'locked';
    pack.lockedAt = now;
    pack.lockedBy = 'usr-001'; // In real app, get from auth
    pack.updatedAt = now;

    packs[index] = pack;
    await writePacks(packs);

    // Log audit event
    await logAuditEvent('report.pack.locked', id, pack.lockedBy);

    return NextResponse.json(pack);
  } catch (error) {
    console.error('Error locking pack:', error);
    return NextResponse.json(
      { error: 'Failed to lock pack' },
      { status: 500 }
    );
  }
}

async function logAuditEvent(
  action: string,
  resourceId: string,
  userId: string
) {
  try {
    const auditPath = path.join(DATA_DIR, 'auditEvents.json');
    let events: unknown[] = [];
    try {
      const content = await fs.readFile(auditPath, 'utf-8');
      events = JSON.parse(content);
    } catch {
      events = [];
    }

    events.push({
      id: `audit-${Date.now()}`,
      action,
      resourceType: 'reportPack',
      resourceId,
      userId,
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(auditPath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

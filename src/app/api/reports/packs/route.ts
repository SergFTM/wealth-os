import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

interface ReportPack {
  id: string;
  name: string;
  packType: string;
  status: string;
  version: number;
  periodType: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  clientId?: string;
  entityIds?: string[];
  portfolioIds?: string[];
  templateId?: string;
  templateVersion?: number;
  sectionIds: string[];
  description?: string;
  notes?: string;
  tags?: string[];
  previousVersionId?: string;
  lockedAt?: string;
  lockedBy?: string;
  publishedAt?: string;
  publishedBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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

function generateId(): string {
  return `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let packs = await readPacks();

    // Filter by status
    const status = searchParams.get('status');
    if (status) {
      packs = packs.filter((p) => p.status === status);
    }

    // Filter by packType
    const packType = searchParams.get('packType');
    if (packType) {
      packs = packs.filter((p) => p.packType === packType);
    }

    // Filter by clientId
    const clientId = searchParams.get('clientId');
    if (clientId) {
      packs = packs.filter((p) => p.clientId === clientId);
    }

    // Search
    const search = searchParams.get('search');
    if (search) {
      const searchLower = search.toLowerCase();
      packs = packs.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.periodLabel.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    const sort = searchParams.get('sort') || 'updatedAt';
    const order = searchParams.get('order') || 'desc';
    packs.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sort];
      const bVal = (b as unknown as Record<string, unknown>)[sort];
      if (aVal === undefined || bVal === undefined) return 0;
      const cmp = String(aVal).localeCompare(String(bVal));
      return order === 'desc' ? -cmp : cmp;
    });

    // Pagination
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const total = packs.length;
    packs = packs.slice(offset, offset + limit);

    return NextResponse.json({
      items: packs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching packs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const packs = await readPacks();

    const now = new Date().toISOString();
    const newPack: ReportPack = {
      id: generateId(),
      name: body.name,
      packType: body.packType || 'custom',
      status: 'draft',
      version: 1,
      periodType: body.periodType || 'custom',
      periodStart: body.periodStart,
      periodEnd: body.periodEnd,
      periodLabel: body.periodLabel,
      clientId: body.clientId,
      entityIds: body.entityIds,
      portfolioIds: body.portfolioIds,
      templateId: body.templateId,
      templateVersion: body.templateVersion,
      sectionIds: [],
      description: body.description,
      tags: body.tags,
      createdBy: body.userId || 'usr-001',
      createdAt: now,
      updatedAt: now,
    };

    packs.push(newPack);
    await writePacks(packs);

    // Log audit event
    await logAuditEvent('report.pack.created', newPack.id, newPack.createdBy, {
      name: newPack.name,
      packType: newPack.packType,
    });

    return NextResponse.json(newPack, { status: 201 });
  } catch (error) {
    console.error('Error creating pack:', error);
    return NextResponse.json(
      { error: 'Failed to create pack' },
      { status: 500 }
    );
  }
}

async function logAuditEvent(
  action: string,
  resourceId: string,
  userId: string,
  details?: Record<string, unknown>
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
      details,
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(auditPath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

interface ReportPack {
  id: string;
  name: string;
  status: string;
  version: number;
  sectionIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lockedAt?: string;
  lockedBy?: string;
  publishedAt?: string;
  publishedBy?: string;
  previousVersionId?: string;
  [key: string]: unknown;
}

interface ReportSection {
  id: string;
  packId: string;
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

async function readSections(): Promise<ReportSection[]> {
  try {
    const filePath = path.join(DATA_DIR, 'reportPackSections.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeSections(sections: ReportSection[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'reportPackSections.json');
  await fs.writeFile(filePath, JSON.stringify(sections, null, 2));
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const packs = await readPacks();
    const originalPack = packs.find((p) => p.id === id);

    if (!originalPack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const newPackId = generateId('pack');
    const userId = body.userId || 'usr-001';

    // Clone the pack
    const newPack: ReportPack = {
      ...originalPack,
      id: newPackId,
      name: body.name || `${originalPack.name} (Copy)`,
      status: 'draft',
      version: 1,
      sectionIds: [],
      previousVersionId: undefined,
      lockedAt: undefined,
      lockedBy: undefined,
      publishedAt: undefined,
      publishedBy: undefined,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };

    // Override period if provided
    if (body.periodStart) newPack.periodStart = body.periodStart;
    if (body.periodEnd) newPack.periodEnd = body.periodEnd;
    if (body.periodLabel) newPack.periodLabel = body.periodLabel;

    // Clone sections
    const sections = await readSections();
    const originalSections = sections.filter((s) => originalPack.sectionIds.includes(s.id));
    const newSectionIds: string[] = [];

    for (const originalSection of originalSections) {
      const newSectionId = generateId('section');
      const newSection: ReportSection = {
        ...originalSection,
        id: newSectionId,
        packId: newPackId,
        isResolved: false,
        resolvedAt: undefined,
        contentJson: undefined,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      };
      sections.push(newSection);
      newSectionIds.push(newSectionId);
    }

    newPack.sectionIds = newSectionIds;

    // Save
    packs.push(newPack);
    await writePacks(packs);
    await writeSections(sections);

    // Log audit event
    await logAuditEvent('report.pack.cloned', newPackId, userId, {
      originalPackId: id,
    });

    return NextResponse.json(newPack, { status: 201 });
  } catch (error) {
    console.error('Error cloning pack:', error);
    return NextResponse.json(
      { error: 'Failed to clone pack' },
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

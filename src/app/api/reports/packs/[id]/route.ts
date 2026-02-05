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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packs = await readPacks();
    const pack = packs.find((p) => p.id === id);

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    return NextResponse.json(pack);
  } catch (error) {
    console.error('Error fetching pack:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pack' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const packs = await readPacks();
    const index = packs.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const pack = packs[index];

    if (pack.status !== 'draft') {
      return NextResponse.json(
        { error: 'Cannot modify non-draft pack' },
        { status: 400 }
      );
    }

    // Update allowed fields
    const updatableFields = ['name', 'description', 'notes', 'tags', 'periodLabel', 'entityIds', 'portfolioIds', 'sectionIds'];
    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        (pack as unknown as Record<string, unknown>)[field] = body[field];
      }
    }

    pack.updatedAt = new Date().toISOString();
    packs[index] = pack;
    await writePacks(packs);

    return NextResponse.json(pack);
  } catch (error) {
    console.error('Error updating pack:', error);
    return NextResponse.json(
      { error: 'Failed to update pack' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (pack.status === 'published') {
      return NextResponse.json(
        { error: 'Cannot delete published pack' },
        { status: 400 }
      );
    }

    packs.splice(index, 1);
    await writePacks(packs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pack:', error);
    return NextResponse.json(
      { error: 'Failed to delete pack' },
      { status: 500 }
    );
  }
}

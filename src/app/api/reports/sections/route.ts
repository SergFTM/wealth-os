import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

interface ReportSection {
  id: string;
  packId: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  order: number;
  dataSource?: {
    moduleKey: string;
    queryParams?: Record<string, unknown>;
    transformKey?: string;
  };
  contentJson?: string;
  customContent?: string;
  displayConfig?: Record<string, unknown>;
  isResolved: boolean;
  resolvedAt?: string;
  errorMessage?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportPack {
  id: string;
  sectionIds: string[];
  status: string;
  updatedAt: string;
  [key: string]: unknown;
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
  return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packId = searchParams.get('packId');

    let sections = await readSections();

    if (packId) {
      sections = sections.filter((s) => s.packId === packId);
    }

    // Sort by order
    sections.sort((a, b) => a.order - b.order);

    return NextResponse.json({ items: sections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packId } = body;

    if (!packId) {
      return NextResponse.json(
        { error: 'packId is required' },
        { status: 400 }
      );
    }

    // Check pack exists and is draft
    const packs = await readPacks();
    const packIndex = packs.findIndex((p) => p.id === packId);

    if (packIndex === -1) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const pack = packs[packIndex];

    if (pack.status !== 'draft') {
      return NextResponse.json(
        { error: 'Cannot add sections to non-draft pack' },
        { status: 400 }
      );
    }

    const sections = await readSections();

    // Get next order
    const packSections = sections.filter((s) => s.packId === packId);
    const nextOrder = packSections.length > 0
      ? Math.max(...packSections.map((s) => s.order)) + 1
      : 1;

    const now = new Date().toISOString();
    const newSection: ReportSection = {
      id: generateId(),
      packId,
      sectionType: body.sectionType || 'custom',
      title: body.title,
      subtitle: body.subtitle,
      order: body.order ?? nextOrder,
      dataSource: body.dataSource,
      customContent: body.customContent,
      displayConfig: body.displayConfig,
      isResolved: !body.dataSource, // No data source = resolved
      createdBy: body.userId || 'usr-001',
      createdAt: now,
      updatedAt: now,
    };

    sections.push(newSection);
    await writeSections(sections);

    // Update pack's sectionIds
    pack.sectionIds = pack.sectionIds || [];
    pack.sectionIds.push(newSection.id);
    pack.updatedAt = now;
    packs[packIndex] = pack;
    await writePacks(packs);

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}

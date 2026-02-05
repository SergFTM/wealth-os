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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sections = await readSections();
    const section = sections.find((s) => s.id === id);

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
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
    const sections = await readSections();
    const index = sections.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const section = sections[index];

    // Check pack is draft
    const packs = await readPacks();
    const pack = packs.find((p) => p.id === section.packId);

    if (pack && pack.status !== 'draft') {
      return NextResponse.json(
        { error: 'Cannot modify section in non-draft pack' },
        { status: 400 }
      );
    }

    // Update allowed fields
    const updatableFields = ['title', 'subtitle', 'order', 'dataSource', 'customContent', 'displayConfig'];
    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        (section as unknown as Record<string, unknown>)[field] = body[field];
      }
    }

    // Reset resolution if data source changed
    if (body.dataSource !== undefined) {
      section.isResolved = !body.dataSource;
      section.resolvedAt = undefined;
      section.contentJson = undefined;
      section.errorMessage = undefined;
    }

    section.updatedAt = new Date().toISOString();
    sections[index] = section;
    await writeSections(sections);

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
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
    const sections = await readSections();
    const index = sections.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const section = sections[index];

    // Check pack is draft
    const packs = await readPacks();
    const packIndex = packs.findIndex((p) => p.id === section.packId);

    if (packIndex !== -1) {
      const pack = packs[packIndex];

      if (pack.status !== 'draft') {
        return NextResponse.json(
          { error: 'Cannot delete section in non-draft pack' },
          { status: 400 }
        );
      }

      // Remove from pack's sectionIds
      pack.sectionIds = pack.sectionIds.filter((sid: string) => sid !== id);
      pack.updatedAt = new Date().toISOString();
      packs[packIndex] = pack;
      await writePacks(packs);
    }

    sections.splice(index, 1);
    await writeSections(sections);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}

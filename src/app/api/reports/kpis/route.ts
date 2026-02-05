import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

interface ReportPack {
  id: string;
  status: string;
  clientSafe?: boolean;
}

interface ReportSection {
  id: string;
  missingSources?: boolean;
}

interface ReportShare {
  id: string;
  status: string;
}

interface ReportExport {
  id: string;
  createdAt: string;
}

interface ReportLibraryItem {
  id: string;
}

async function readCollection<T>(name: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, `${name}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const [packs, sections, shares, exports, libraryItems] = await Promise.all([
      readCollection<ReportPack>('reportPacks'),
      readCollection<ReportSection>('reportPackSections'),
      readCollection<ReportShare>('reportShares'),
      readCollection<ReportExport>('reportExports'),
      readCollection<ReportLibraryItem>('reportLibraryItems'),
    ]);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const kpis = {
      draftPacks: packs.filter((p) => p.status === 'draft').length,
      lockedPacks: packs.filter((p) => p.status === 'locked').length,
      publishedPacks: packs.filter((p) => p.status === 'published').length,
      exports7d: exports.filter((e) => {
        const created = new Date(e.createdAt);
        return created >= sevenDaysAgo;
      }).length,
      activeShares: shares.filter((s) => s.status === 'active').length,
      missingSources: sections.filter((s) => s.missingSources === true).length,
      clientSafePacks: packs.filter((p) => p.clientSafe === true).length,
      libraryItems: libraryItems.length,
    };

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error fetching report KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    );
  }
}

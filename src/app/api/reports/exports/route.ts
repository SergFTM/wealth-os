import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

interface ReportExport {
  id: string;
  packId: string;
  packVersion: number;
  format: string;
  status: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  exportOptions?: Record<string, unknown>;
  downloadCount: number;
  lastDownloadAt?: string;
  requestedBy: string;
  createdAt: string;
}

interface ReportPack {
  id: string;
  name: string;
  version: number;
  periodLabel: string;
  [key: string]: unknown;
}

async function readExports(): Promise<ReportExport[]> {
  try {
    const filePath = path.join(DATA_DIR, 'reportExports.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeExports(exports: ReportExport[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'reportExports.json');
  await fs.writeFile(filePath, JSON.stringify(exports, null, 2));
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

function generateId(): string {
  return `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    json: 'application/json',
    manifest: 'application/json',
  };
  return mimeTypes[format] || 'application/octet-stream';
}

function getFileExtension(format: string): string {
  const extensions: Record<string, string> = {
    pdf: 'pdf',
    csv: 'csv',
    xlsx: 'xlsx',
    json: 'json',
    manifest: 'json',
  };
  return extensions[format] || 'bin';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let exports = await readExports();

    // Filter by packId
    const packId = searchParams.get('packId');
    if (packId) {
      exports = exports.filter((e) => e.packId === packId);
    }

    // Filter by format
    const format = searchParams.get('format');
    if (format) {
      exports = exports.filter((e) => e.format === format);
    }

    // Sort by createdAt desc
    exports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const total = exports.length;
    exports = exports.slice(offset, offset + limit);

    return NextResponse.json({ items: exports, total, limit, offset });
  } catch (error) {
    console.error('Error fetching exports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packId, format } = body;

    if (!packId || !format) {
      return NextResponse.json(
        { error: 'packId and format are required' },
        { status: 400 }
      );
    }

    // Check pack exists
    const packs = await readPacks();
    const pack = packs.find((p) => p.id === packId);

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const exports = await readExports();
    const now = new Date().toISOString();

    // Generate filename
    const sanitizedName = pack.name.replace(/[^a-zA-Z0-9-_]/g, '_');
    const sanitizedPeriod = pack.periodLabel.replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);
    const extension = getFileExtension(format);
    const fileName = `${sanitizedName}_${sanitizedPeriod}_v${pack.version}_${timestamp}.${extension}`;

    const newExport: ReportExport = {
      id: generateId(),
      packId,
      packVersion: pack.version,
      format,
      status: 'completed', // Simulating instant completion
      fileName,
      filePath: `/exports/${fileName}`,
      fileSize: Math.floor(Math.random() * 1000000) + 50000, // Mock file size
      mimeType: getMimeType(format),
      startedAt: now,
      completedAt: now,
      exportOptions: body.exportOptions,
      downloadCount: 0,
      requestedBy: body.userId || 'usr-001',
      createdAt: now,
    };

    exports.push(newExport);
    await writeExports(exports);

    // Log audit event
    await logAuditEvent('report.export.created', newExport.id, newExport.requestedBy, {
      packId,
      format,
      fileName,
    });

    return NextResponse.json(newExport, { status: 201 });
  } catch (error) {
    console.error('Error creating export:', error);
    return NextResponse.json(
      { error: 'Failed to create export' },
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
      resourceType: 'reportExport',
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

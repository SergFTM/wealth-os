import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getStorage } from '@/db/storage/getStorage';
import { ensureSeedOnce } from '@/db/storage/ensureSeed';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `${base}-${ts}-${rand}${ext}`;
}

export async function POST(request: NextRequest) {
  await ensureSeedOnce();
  const storage = getStorage();

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const fileName = generateFileName(file.name);
  const filePath = path.join(UPLOAD_DIR, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const ext = path.extname(file.name).replace('.', '').toLowerCase();

  const doc = await storage.create('documents', {
    clientId: formData.get('clientId') as string || 'client-001',
    name: formData.get('name') as string || file.name.replace(/\.[^/.]+$/, ''),
    category: formData.get('category') as string || 'misc',
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    fileType: ext,
    fileSize: file.size,
    filePath: `/uploads/${fileName}`,
    currentVersionId: null,
    confidentiality: formData.get('confidentiality') as string || 'internal',
    linkedCount: 0,
    createdBy: formData.get('createdBy') as string || 'ops@wealth.os',
    status: 'active',
    description: formData.get('description') as string || '',
  });

  const version = await storage.create('documentVersions', {
    documentId: doc.id,
    versionNumber: 1,
    filePath: `/uploads/${fileName}`,
    uploadedAt: new Date().toISOString(),
    uploadedBy: formData.get('createdBy') as string || 'ops@wealth.os',
    checksum: '',
  });

  await storage.update('documents', doc.id, { currentVersionId: version.id } as Record<string, unknown>);

  const docName = formData.get('name') as string || file.name.replace(/\.[^/.]+$/, '');
  await storage.appendAudit({
    actorRole: 'admin',
    actorName: formData.get('createdBy') as string || 'ops@wealth.os',
    action: 'create',
    collection: 'documents',
    recordId: doc.id,
    summary: `Uploaded document: ${docName}`,
    severity: 'info',
  });

  return NextResponse.json({ document: { ...doc, currentVersionId: version.id }, version }, { status: 201 });
}

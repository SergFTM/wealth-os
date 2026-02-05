/**
 * Tenant Branding API
 * GET/PUT branding settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/db/data/brandings.json');

async function readData() {
  try {
    const content = await readFile(DATA_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeData(data: unknown[]) {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

const DEFAULT_BRANDING = {
  id: 'brand_001',
  palette: {
    sage: '#9CAF88',
    gold: '#D4AF37',
    ivory: '#FFFFF0',
    gray: '#6B7280',
  },
  gradientPreset: 'sage-to-gold',
  density: 'comfortable',
  stickyHeader: true,
  stickyFirstColumn: true,
  showBreadcrumbs: true,
};

export async function GET() {
  const brandings = await readData();
  const branding = brandings[0] || DEFAULT_BRANDING;
  return NextResponse.json({ data: branding });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const brandings = await readData();

  if (brandings.length === 0) {
    const newBranding = {
      ...DEFAULT_BRANDING,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    await writeData([newBranding]);
    return NextResponse.json({ data: newBranding });
  }

  brandings[0] = {
    ...brandings[0],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  await writeData(brandings);

  return NextResponse.json({ data: brandings[0] });
}

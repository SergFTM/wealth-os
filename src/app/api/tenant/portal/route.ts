/**
 * Tenant Portal Config API
 * GET/PUT portal settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/db/data/portalConfigs.json');

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

const DEFAULT_PORTAL = {
  id: 'portal_001',
  portalEnabled: true,
  allowedModules: ['net-worth-summary', 'documents', 'communications'],
  clientMenuLabels: [],
  clientSafeDefault: true,
  showOnlyPublishedPacks: true,
  showWelcomeMessage: false,
};

export async function GET() {
  const configs = await readData();
  const config = configs[0] || DEFAULT_PORTAL;
  return NextResponse.json({ data: config });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const configs = await readData();

  if (configs.length === 0) {
    const newConfig = {
      ...DEFAULT_PORTAL,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    await writeData([newConfig]);
    return NextResponse.json({ data: newConfig });
  }

  configs[0] = {
    ...configs[0],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  await writeData(configs);

  return NextResponse.json({ data: configs[0] });
}

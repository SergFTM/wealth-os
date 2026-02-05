/**
 * Tenant Feature Flags API
 * GET all / POST new / PUT update feature flags
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/db/data/featureFlags.json');

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const enabled = searchParams.get('enabled');
  const audience = searchParams.get('audience');

  let flags = await readData();

  if (enabled !== null) {
    const isEnabled = enabled === 'true';
    flags = flags.filter((f: { enabled: boolean }) => f.enabled === isEnabled);
  }

  if (audience) {
    flags = flags.filter((f: { audience: string }) =>
      f.audience === audience || f.audience === 'both'
    );
  }

  return NextResponse.json({ data: flags });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const flags = await readData();

  // Check for duplicate key
  if (flags.some((f: { key: string }) => f.key === body.key)) {
    return NextResponse.json(
      { error: 'Flag with this key already exists' },
      { status: 400 }
    );
  }

  const newFlag = {
    id: `flag_${Date.now()}`,
    ...body,
    enabled: body.enabled ?? false,
    audience: body.audience || 'both',
    rolloutPct: body.rolloutPct ?? 100,
    updatedAt: new Date().toISOString(),
  };

  flags.push(newFlag);
  await writeData(flags);

  return NextResponse.json({ data: newFlag }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const flags = await readData();
  const index = flags.findIndex((f: { id: string }) => f.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
  }

  flags[index] = {
    ...flags[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeData(flags);
  return NextResponse.json({ data: flags[index] });
}

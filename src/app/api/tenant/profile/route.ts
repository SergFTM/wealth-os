/**
 * Tenant Profile API
 * GET/PUT tenant profile settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/db/data/tenantProfiles.json');

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

export async function GET() {
  const profiles = await readData();
  // Return the first (default) profile
  const profile = profiles[0] || null;
  return NextResponse.json({ data: profile });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const profiles = await readData();

  if (profiles.length === 0) {
    // Create new profile
    const newProfile = {
      id: 'tenant_001',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await writeData([newProfile]);
    return NextResponse.json({ data: newProfile });
  }

  // Update existing profile
  profiles[0] = {
    ...profiles[0],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  await writeData(profiles);

  return NextResponse.json({ data: profiles[0] });
}

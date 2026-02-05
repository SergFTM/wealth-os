/**
 * Tenant Policy Banners API
 * GET all / POST new / PUT update policy banners
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/db/data/policyBanners.json');

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
  const moduleKey = searchParams.get('moduleKey');
  const status = searchParams.get('status');

  let banners = await readData();

  if (moduleKey) {
    banners = banners.filter((b: { moduleKey: string }) =>
      b.moduleKey === moduleKey || b.moduleKey === 'global'
    );
  }

  if (status) {
    banners = banners.filter((b: { status: string }) => b.status === status);
  }

  return NextResponse.json({ data: banners });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const banners = await readData();

  const newBanner = {
    id: `policy_${Date.now()}`,
    ...body,
    status: body.status || 'inactive',
    order: body.order || banners.length + 1,
    updatedAt: new Date().toISOString(),
  };

  banners.push(newBanner);
  await writeData(banners);

  return NextResponse.json({ data: newBanner }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const banners = await readData();
  const index = banners.findIndex((b: { id: string }) => b.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
  }

  banners[index] = {
    ...banners[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeData(banners);
  return NextResponse.json({ data: banners[index] });
}

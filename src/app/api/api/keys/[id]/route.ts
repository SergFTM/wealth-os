import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'db', 'data');

async function loadCollection<T>(name: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_PATH, `${name}.json`);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T[];
  } catch {
    return [];
  }
}

async function saveCollection<T>(name: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_PATH, `${name}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKeys = await loadCollection<Record<string, unknown>>('apiKeys');
    const apiKey = apiKeys.find((k) => k.id === id);

    if (!apiKey) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    // Also load scopes
    const scopes = await loadCollection<Record<string, unknown>>('apiKeyScopes');
    const keyScopes = scopes.filter((s) => s.apiKeyId === id);

    return NextResponse.json({ apiKey, scopes: keyScopes });
  } catch (error) {
    console.error('Error loading API key:', error);
    return NextResponse.json({ error: 'Failed to load key' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const apiKeys = await loadCollection<Record<string, unknown>>('apiKeys');
    const index = apiKeys.findIndex((k) => k.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    apiKeys[index] = {
      ...apiKeys[index],
      ...body,
      updatedAt: now,
    };

    await saveCollection('apiKeys', apiKeys);

    return NextResponse.json(apiKeys[index]);
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Failed to update key' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKeys = await loadCollection<Record<string, unknown>>('apiKeys');
    const index = apiKeys.findIndex((k) => k.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    // Soft delete - mark as revoked
    const now = new Date().toISOString();
    apiKeys[index] = {
      ...apiKeys[index],
      status: 'revoked',
      revokedAt: now,
      revokedBy: 'user_admin',
    };

    await saveCollection('apiKeys', apiKeys);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: `aud_${Date.now()}`,
      action: 'api_key.revoked',
      collection: 'apiKeys',
      recordId: id,
      summary: `API key "${apiKeys[index].name}" revoked`,
      actorRole: 'admin',
      severity: 'warning',
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Failed to delete key' }, { status: 500 });
  }
}

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

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

function maskUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}/***`;
  } catch {
    return '***';
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let webhooks = await loadCollection<Record<string, unknown>>('webhooks');

    if (status) {
      webhooks = webhooks.filter((w) => w.status === status);
    }

    // Sort by createdAt descending
    webhooks.sort((a, b) =>
      new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );

    return NextResponse.json(webhooks);
  } catch (error) {
    console.error('Error loading webhooks:', error);
    return NextResponse.json({ error: 'Failed to load webhooks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, targetUrl, eventTypes, scopeType, scopeId, clientId, headers } = body;

    if (!name || !targetUrl || !eventTypes?.length) {
      return NextResponse.json(
        { error: 'name, targetUrl, and eventTypes are required' },
        { status: 400 }
      );
    }

    const webhooks = await loadCollection<Record<string, unknown>>('webhooks');
    const now = new Date().toISOString();

    const newWebhook = {
      id: generateId('wh'),
      clientId,
      name,
      targetUrl,
      targetUrlMasked: maskUrl(targetUrl),
      eventTypes,
      scopeType: scopeType || 'global',
      scopeId,
      status: 'active',
      headers,
      createdAt: now,
      updatedAt: now,
      createdBy: 'user_admin',
    };

    webhooks.push(newWebhook);
    await saveCollection('webhooks', webhooks);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: generateId('aud'),
      action: 'webhook.created',
      collection: 'webhooks',
      recordId: newWebhook.id,
      summary: `Webhook "${name}" created for ${eventTypes.join(', ')}`,
      actorRole: 'admin',
      severity: 'info',
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    return NextResponse.json(newWebhook);
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}

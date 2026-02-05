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

function maskUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}/***`;
  } catch {
    return '***';
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const webhooks = await loadCollection<Record<string, unknown>>('webhooks');
    const webhook = webhooks.find((w) => w.id === id);

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Load recent deliveries
    const deliveries = await loadCollection<Record<string, unknown>>('webhookDeliveries');
    const recentDeliveries = deliveries
      .filter((d) => d.webhookId === id)
      .sort((a, b) =>
        new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
      )
      .slice(0, 20);

    return NextResponse.json({ webhook, deliveries: recentDeliveries });
  } catch (error) {
    console.error('Error loading webhook:', error);
    return NextResponse.json({ error: 'Failed to load webhook' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const webhooks = await loadCollection<Record<string, unknown>>('webhooks');
    const index = webhooks.findIndex((w) => w.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    // If targetUrl is updated, update masked version
    if (body.targetUrl) {
      body.targetUrlMasked = maskUrl(body.targetUrl);
    }

    webhooks[index] = {
      ...webhooks[index],
      ...body,
      updatedAt: now,
    };

    await saveCollection('webhooks', webhooks);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: `aud_${Date.now()}`,
      action: 'webhook.updated',
      collection: 'webhooks',
      recordId: id,
      summary: `Webhook "${webhooks[index].name}" updated`,
      actorRole: 'admin',
      severity: 'info',
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    return NextResponse.json(webhooks[index]);
  } catch (error) {
    console.error('Error updating webhook:', error);
    return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const webhooks = await loadCollection<Record<string, unknown>>('webhooks');
    const index = webhooks.findIndex((w) => w.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Soft delete
    webhooks[index] = {
      ...webhooks[index],
      status: 'deleted',
      updatedAt: now,
    };

    await saveCollection('webhooks', webhooks);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}

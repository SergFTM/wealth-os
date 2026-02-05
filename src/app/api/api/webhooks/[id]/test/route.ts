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

// Simulate delivery (70% success, 30% fail)
function simulateDelivery(): {
  success: boolean;
  statusCode: number;
  response: string;
  durationMs: number;
} {
  const success = Math.random() < 0.7;
  const durationMs = Math.floor(Math.random() * 500) + 50;

  if (success) {
    return {
      success: true,
      statusCode: 200,
      response: '{"status":"ok","received":true}',
      durationMs,
    };
  }

  const errors = [
    { statusCode: 500, response: '{"error":"Internal Server Error"}' },
    { statusCode: 502, response: '{"error":"Bad Gateway"}' },
    { statusCode: 503, response: '{"error":"Service Unavailable"}' },
  ];
  const error = errors[Math.floor(Math.random() * errors.length)];

  return {
    success: false,
    statusCode: error.statusCode,
    response: error.response,
    durationMs,
  };
}

export async function POST(
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

    if (webhook.status !== 'active') {
      return NextResponse.json(
        { error: 'Webhook is not active' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const eventTypes = webhook.eventTypes as string[];
    const eventType = eventTypes[0] || 'test.event';

    // Create test event
    const events = await loadCollection<Record<string, unknown>>('webhookEvents');
    const testEvent = {
      id: generateId('evt'),
      clientId: webhook.clientId,
      eventType,
      payload: {
        test: true,
        message: 'This is a test event',
        timestamp: now,
        webhookId: id,
      },
      scopeType: webhook.scopeType,
      scopeId: webhook.scopeId,
      sourceModule: 'api',
      sourceRecordId: id,
      createdAt: now,
    };
    events.push(testEvent);
    await saveCollection('webhookEvents', events);

    // Simulate delivery
    const result = simulateDelivery();

    // Create delivery record
    const deliveries = await loadCollection<Record<string, unknown>>('webhookDeliveries');
    const delivery = {
      id: generateId('dlv'),
      clientId: webhook.clientId,
      webhookId: id,
      eventId: testEvent.id,
      status: result.success ? 'success' : 'failed',
      attempts: 1,
      maxAttempts: 5,
      lastAttemptAt: now,
      completedAt: result.success ? now : undefined,
      responseCode: result.statusCode,
      responseBodySnippet: result.response,
      durationMs: result.durationMs,
      createdAt: now,
    };
    deliveries.push(delivery);
    await saveCollection('webhookDeliveries', deliveries);

    // Update webhook lastDeliveryAt
    const webhookIndex = webhooks.findIndex((w) => w.id === id);
    webhooks[webhookIndex] = {
      ...webhook,
      lastDeliveryAt: now,
    };
    await saveCollection('webhooks', webhooks);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: generateId('aud'),
      action: 'webhook.tested',
      collection: 'webhooks',
      recordId: id,
      summary: `Webhook "${webhook.name}" tested - ${result.success ? 'success' : 'failed'}`,
      actorRole: 'admin',
      severity: result.success ? 'info' : 'warning',
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    return NextResponse.json({
      event: testEvent,
      delivery,
      result: {
        success: result.success,
        statusCode: result.statusCode,
        durationMs: result.durationMs,
      },
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json({ error: 'Failed to test webhook' }, { status: 500 });
  }
}

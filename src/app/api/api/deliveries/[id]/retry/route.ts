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

// Simulate delivery
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
      response: '{"status":"ok"}',
      durationMs,
    };
  }

  return {
    success: false,
    statusCode: Math.random() < 0.5 ? 500 : 503,
    response: '{"error":"Server error"}',
    durationMs,
  };
}

const RETRY_BACKOFF = [1, 5, 15, 60, 240];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deliveries = await loadCollection<Record<string, unknown>>('webhookDeliveries');
    const index = deliveries.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    const delivery = deliveries[index];

    if (delivery.status === 'success' || delivery.status === 'dead') {
      return NextResponse.json(
        { error: 'Cannot retry completed or dead deliveries' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const attempts = (delivery.attempts as number) + 1;
    const maxAttempts = delivery.maxAttempts as number;

    // Simulate delivery
    const result = simulateDelivery();

    let newStatus: string;
    let nextRetryAt: string | undefined;

    if (result.success) {
      newStatus = 'success';
    } else if (attempts >= maxAttempts) {
      newStatus = 'dead';
    } else {
      newStatus = 'retrying';
      const backoffMinutes = RETRY_BACKOFF[attempts - 1] || 240;
      nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000).toISOString();
    }

    deliveries[index] = {
      ...delivery,
      status: newStatus,
      attempts,
      lastAttemptAt: now,
      completedAt: newStatus === 'success' || newStatus === 'dead' ? now : undefined,
      nextRetryAt,
      responseCode: result.statusCode,
      responseBodySnippet: result.response,
      durationMs: result.durationMs,
    };

    await saveCollection('webhookDeliveries', deliveries);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: generateId('aud'),
      action: 'delivery.retried',
      collection: 'webhookDeliveries',
      recordId: id,
      summary: `Delivery retried - ${newStatus}`,
      actorRole: 'admin',
      severity: result.success ? 'info' : 'warning',
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    return NextResponse.json({
      delivery: deliveries[index],
      result: {
        success: result.success,
        statusCode: result.statusCode,
        durationMs: result.durationMs,
      },
    });
  } catch (error) {
    console.error('Error retrying delivery:', error);
    return NextResponse.json({ error: 'Failed to retry delivery' }, { status: 500 });
  }
}

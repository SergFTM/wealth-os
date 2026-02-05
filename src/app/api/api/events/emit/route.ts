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

const DEMO_EVENTS = [
  {
    eventType: 'invoice.paid',
    payload: {
      invoiceId: 'inv_demo',
      amount: 25000,
      currency: 'USD',
    },
    sourceModule: 'billing',
  },
  {
    eventType: 'approval.approved',
    payload: {
      approvalId: 'apr_demo',
      taskId: 'task_demo',
      approvedBy: 'user_cio',
    },
    sourceModule: 'workflow',
  },
  {
    eventType: 'document.uploaded',
    payload: {
      documentId: 'doc_demo',
      filename: 'Q4_Statement.pdf',
      size: 1048576,
    },
    sourceModule: 'documents',
  },
  {
    eventType: 'sync.failed',
    payload: {
      syncJobId: 'sync_demo',
      connector: 'custodian_a',
      error: 'Connection timeout',
    },
    sourceModule: 'integrations',
  },
  {
    eventType: 'risk.breach',
    payload: {
      breachId: 'breach_demo',
      policyId: 'ips_001',
      metric: 'equity_allocation',
      threshold: 60,
      actual: 67,
    },
    sourceModule: 'risk',
  },
];

export async function POST(request: NextRequest) {
  try {
    const now = new Date().toISOString();

    // Load webhooks
    const webhooks = await loadCollection<Record<string, unknown>>('webhooks');
    const activeWebhooks = webhooks.filter((w) => w.status === 'active');

    if (activeWebhooks.length === 0) {
      return NextResponse.json(
        { error: 'No active webhooks to receive events' },
        { status: 400 }
      );
    }

    // Create events
    const events = await loadCollection<Record<string, unknown>>('webhookEvents');
    const deliveries = await loadCollection<Record<string, unknown>>('webhookDeliveries');

    const newEvents: Record<string, unknown>[] = [];
    const newDeliveries: Record<string, unknown>[] = [];

    for (const demoEvent of DEMO_EVENTS) {
      const event = {
        id: generateId('evt'),
        eventType: demoEvent.eventType,
        payload: {
          ...demoEvent.payload,
          timestamp: now,
        },
        scopeType: 'global',
        sourceModule: demoEvent.sourceModule,
        createdAt: now,
      };
      newEvents.push(event);

      // Find matching webhooks
      for (const webhook of activeWebhooks) {
        const eventTypes = webhook.eventTypes as string[];
        if (eventTypes.includes(demoEvent.eventType)) {
          const result = simulateDelivery();
          const RETRY_BACKOFF = [1, 5, 15, 60, 240];

          const delivery = {
            id: generateId('dlv'),
            clientId: webhook.clientId,
            webhookId: webhook.id,
            eventId: event.id,
            status: result.success ? 'success' : 'retrying',
            attempts: 1,
            maxAttempts: 5,
            lastAttemptAt: now,
            completedAt: result.success ? now : undefined,
            nextRetryAt: result.success
              ? undefined
              : new Date(Date.now() + RETRY_BACKOFF[0] * 60 * 1000).toISOString(),
            responseCode: result.statusCode,
            responseBodySnippet: result.response,
            durationMs: result.durationMs,
            createdAt: now,
          };
          newDeliveries.push(delivery);

          // Update webhook lastDeliveryAt
          const idx = webhooks.findIndex((w) => w.id === webhook.id);
          if (idx !== -1) {
            webhooks[idx] = { ...webhooks[idx], lastDeliveryAt: now };
          }
        }
      }
    }

    // Save all
    events.push(...newEvents);
    deliveries.push(...newDeliveries);

    await Promise.all([
      saveCollection('webhookEvents', events),
      saveCollection('webhookDeliveries', deliveries),
      saveCollection('webhooks', webhooks),
    ]);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: generateId('aud'),
      action: 'events.emitted',
      collection: 'webhookEvents',
      summary: `Generated ${newEvents.length} demo events, ${newDeliveries.length} deliveries`,
      actorRole: 'admin',
      severity: 'info',
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    return NextResponse.json({
      eventsCreated: newEvents.length,
      deliveriesCreated: newDeliveries.length,
      events: newEvents,
      deliveries: newDeliveries,
    });
  } catch (error) {
    console.error('Error emitting events:', error);
    return NextResponse.json({ error: 'Failed to emit events' }, { status: 500 });
  }
}

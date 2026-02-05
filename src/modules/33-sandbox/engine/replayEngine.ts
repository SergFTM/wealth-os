/**
 * Replay Engine
 * Simulate and replay events for webhook testing
 */

import { logToSandbox } from './sbLogging';

export type EventType =
  | 'invoice.paid'
  | 'invoice.created'
  | 'sync.completed'
  | 'sync.failed'
  | 'risk.breach'
  | 'document.uploaded'
  | 'position.changed'
  | 'capital_call.due'
  | 'distribution.received'
  | 'webhook.test';

export interface ReplayConfig {
  envId: string;
  eventType: EventType;
  count: number;
  webhookTarget?: {
    url: string;
    headers?: Record<string, string>;
    simulate?: boolean; // If true, don't make real HTTP calls
  };
}

export interface ReplayResult {
  runId: string;
  status: 'completed' | 'failed' | 'partial';
  eventsGenerated: number;
  deliveriesCreated: number;
  logsCreated: number;
  errors: string[];
  durationMs: number;
}

export interface GeneratedEvent {
  id: string;
  type: EventType;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface WebhookDelivery {
  id: string;
  eventId: string;
  webhookUrl: string;
  status: 'pending' | 'delivered' | 'failed' | 'simulated';
  requestPayload: Record<string, unknown>;
  responseStatus?: number;
  responseBody?: string;
  deliveredAt?: string;
}

function generateEventId(): string {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

function generateRunId(): string {
  return `sbrep-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

function generateDeliveryId(): string {
  return `dlv-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

// Event payload generators
const eventGenerators: Record<EventType, (index: number) => Record<string, unknown>> = {
  'invoice.paid': (index) => ({
    invoiceId: `INV-${2024}-${String(index).padStart(5, '0')}`,
    amount: Math.floor(Math.random() * 50000) + 100,
    currency: 'USD',
    paidAt: new Date().toISOString(),
    paymentMethod: ['ach', 'wire', 'check'][index % 3],
  }),

  'invoice.created': (index) => ({
    invoiceId: `INV-${2024}-${String(index).padStart(5, '0')}`,
    vendor: `Vendor ${index}`,
    amount: Math.floor(Math.random() * 50000) + 100,
    currency: 'USD',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }),

  'sync.completed': (index) => ({
    jobId: `job-${index}`,
    connectorId: `con-${index % 5}`,
    recordsProcessed: Math.floor(Math.random() * 1000),
    duration: Math.floor(Math.random() * 60000),
  }),

  'sync.failed': (index) => ({
    jobId: `job-${index}`,
    connectorId: `con-${index % 5}`,
    errorCode: ['TIMEOUT', 'AUTH_ERROR', 'VALIDATION_ERROR'][index % 3],
    errorMessage: 'Sync operation failed',
  }),

  'risk.breach': (index) => ({
    breachId: `breach-${index}`,
    policyId: `policy-${index % 3}`,
    severity: ['warning', 'critical'][index % 2],
    metric: `risk_metric_${index % 5}`,
    threshold: 0.1,
    actual: 0.15 + Math.random() * 0.1,
  }),

  'document.uploaded': (index) => ({
    documentId: `doc-${index}`,
    fileName: `document_${index}.pdf`,
    size: Math.floor(Math.random() * 5000000),
    category: ['statement', 'contract', 'report'][index % 3],
    uploadedBy: 'user@example.com',
  }),

  'position.changed': (index) => ({
    positionId: `pos-${index}`,
    securityId: ['AAPL', 'GOOGL', 'MSFT'][index % 3],
    previousQuantity: 100,
    newQuantity: 100 + (index % 2 === 0 ? 10 : -10),
    changeType: index % 2 === 0 ? 'buy' : 'sell',
  }),

  'capital_call.due': (index) => ({
    callId: `call-${index}`,
    fundId: `fund-${index % 5}`,
    amount: Math.floor(Math.random() * 1000000) + 50000,
    currency: 'USD',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  }),

  'distribution.received': (index) => ({
    distributionId: `dist-${index}`,
    fundId: `fund-${index % 5}`,
    amount: Math.floor(Math.random() * 500000) + 10000,
    currency: 'USD',
    type: ['return_of_capital', 'dividend', 'gain'][index % 3],
  }),

  'webhook.test': (index) => ({
    testId: `test-${index}`,
    message: 'This is a test webhook event',
    timestamp: new Date().toISOString(),
    index,
  }),
};

function generateEvent(eventType: EventType, index: number): GeneratedEvent {
  return {
    id: generateEventId(),
    type: eventType,
    timestamp: new Date().toISOString(),
    payload: eventGenerators[eventType](index),
  };
}

async function simulateWebhookDelivery(
  event: GeneratedEvent,
  webhookUrl: string,
  simulate: boolean
): Promise<WebhookDelivery> {
  const delivery: WebhookDelivery = {
    id: generateDeliveryId(),
    eventId: event.id,
    webhookUrl,
    status: 'pending',
    requestPayload: {
      event: event.type,
      data: event.payload,
      timestamp: event.timestamp,
    },
  };

  if (simulate) {
    // Simulate delivery without actual HTTP call
    await new Promise(resolve => setTimeout(resolve, 50));
    delivery.status = 'simulated';
    delivery.responseStatus = 200;
    delivery.responseBody = '{"ok": true}';
    delivery.deliveredAt = new Date().toISOString();
  } else {
    // In production, this would make a real HTTP call
    // For MVP, we always simulate
    delivery.status = 'simulated';
    delivery.responseStatus = 200;
    delivery.deliveredAt = new Date().toISOString();
  }

  return delivery;
}

export async function runReplay(
  config: ReplayConfig,
  onProgress?: (current: number, total: number) => void
): Promise<ReplayResult> {
  const runId = generateRunId();
  const startTime = Date.now();

  const result: ReplayResult = {
    runId,
    status: 'completed',
    eventsGenerated: 0,
    deliveriesCreated: 0,
    logsCreated: 0,
    errors: [],
    durationMs: 0,
  };

  try {
    await logToSandbox({
      envId: config.envId,
      level: 'info',
      source: 'replay',
      message: `Starting replay: ${config.count} ${config.eventType} events`,
      refs: { replayRunId: runId },
    });
    result.logsCreated++;

    for (let i = 0; i < config.count; i++) {
      // Generate event
      const event = generateEvent(config.eventType, i);
      result.eventsGenerated++;

      // Log event generation
      await logToSandbox({
        envId: config.envId,
        level: 'debug',
        source: 'replay',
        message: `Generated event: ${event.type} (${event.id})`,
        refs: { replayRunId: runId, eventId: event.id },
      });
      result.logsCreated++;

      // Create webhook delivery if target configured
      if (config.webhookTarget) {
        const delivery = await simulateWebhookDelivery(
          event,
          config.webhookTarget.url || 'https://sandbox.webhook.test/endpoint',
          config.webhookTarget.simulate !== false
        );
        result.deliveriesCreated++;

        await logToSandbox({
          envId: config.envId,
          level: 'info',
          source: 'replay',
          message: `Webhook delivery ${delivery.status}: ${delivery.id}`,
          refs: { replayRunId: runId, deliveryId: delivery.id },
        });
        result.logsCreated++;
      }

      // Report progress
      if (onProgress) {
        onProgress(i + 1, config.count);
      }

      // Small delay between events
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    await logToSandbox({
      envId: config.envId,
      level: 'info',
      source: 'replay',
      message: `Replay completed: ${result.eventsGenerated} events, ${result.deliveriesCreated} deliveries`,
      refs: { replayRunId: runId },
    });
    result.logsCreated++;

  } catch (error) {
    result.status = 'failed';
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');

    await logToSandbox({
      envId: config.envId,
      level: 'error',
      source: 'replay',
      message: `Replay failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      refs: { replayRunId: runId },
    });
    result.logsCreated++;
  }

  result.durationMs = Date.now() - startTime;
  return result;
}

export function getAvailableEventTypes(): Array<{ type: EventType; label: string }> {
  return [
    { type: 'invoice.paid', label: 'Invoice Paid' },
    { type: 'invoice.created', label: 'Invoice Created' },
    { type: 'sync.completed', label: 'Sync Completed' },
    { type: 'sync.failed', label: 'Sync Failed' },
    { type: 'risk.breach', label: 'Risk Breach' },
    { type: 'document.uploaded', label: 'Document Uploaded' },
    { type: 'position.changed', label: 'Position Changed' },
    { type: 'capital_call.due', label: 'Capital Call Due' },
    { type: 'distribution.received', label: 'Distribution Received' },
    { type: 'webhook.test', label: 'Webhook Test' },
  ];
}

/**
 * Webhook Simulator Engine
 * Simulates webhook deliveries without making real HTTP requests
 */

import { WebhookDelivery, RETRY_BACKOFF_MINUTES, MAX_RETRY_ATTEMPTS } from '../schema/webhookDelivery';
import { WebhookEvent } from '../schema/webhookEvent';
import { Webhook, EventType } from '../schema/webhook';
import { generateId } from './apiAuth';

// Simulate delivery attempt result
export interface SimulatedResult {
  success: boolean;
  statusCode: number;
  responseBody: string;
  durationMs: number;
  errorMessage?: string;
}

// Simulate a delivery attempt (70% success, 30% fail)
export function simulateDeliveryAttempt(): SimulatedResult {
  const success = Math.random() < 0.7;
  const durationMs = Math.floor(Math.random() * 500) + 50;

  if (success) {
    return {
      success: true,
      statusCode: 200,
      responseBody: '{"status":"ok","received":true}',
      durationMs,
    };
  }

  // Simulate various error scenarios
  const errors = [
    { statusCode: 500, message: 'Internal Server Error' },
    { statusCode: 502, message: 'Bad Gateway' },
    { statusCode: 503, message: 'Service Unavailable' },
    { statusCode: 504, message: 'Gateway Timeout' },
    { statusCode: 0, message: 'Connection refused' },
  ];

  const error = errors[Math.floor(Math.random() * errors.length)];

  return {
    success: false,
    statusCode: error.statusCode,
    responseBody: `{"error":"${error.message}"}`,
    durationMs,
    errorMessage: error.message,
  };
}

// Process a delivery and update its state
export function processDelivery(delivery: WebhookDelivery): WebhookDelivery {
  const result = simulateDeliveryAttempt();
  const now = new Date().toISOString();

  const newAttempts = delivery.attempts + 1;

  if (result.success) {
    return {
      ...delivery,
      status: 'success',
      attempts: newAttempts,
      lastAttemptAt: now,
      completedAt: now,
      responseCode: result.statusCode,
      responseBodySnippet: result.responseBody.substring(0, 200),
      durationMs: result.durationMs,
      nextRetryAt: undefined,
      errorMessage: undefined,
    };
  }

  // Failed attempt
  if (newAttempts >= delivery.maxAttempts) {
    // Max retries reached - dead letter
    return {
      ...delivery,
      status: 'dead',
      attempts: newAttempts,
      lastAttemptAt: now,
      completedAt: now,
      responseCode: result.statusCode,
      responseBodySnippet: result.responseBody.substring(0, 200),
      durationMs: result.durationMs,
      errorMessage: result.errorMessage,
      nextRetryAt: undefined,
    };
  }

  // Schedule retry
  const backoffMinutes = RETRY_BACKOFF_MINUTES[newAttempts - 1] || 240;
  const nextRetry = new Date();
  nextRetry.setMinutes(nextRetry.getMinutes() + backoffMinutes);

  return {
    ...delivery,
    status: 'retrying',
    attempts: newAttempts,
    lastAttemptAt: now,
    nextRetryAt: nextRetry.toISOString(),
    responseCode: result.statusCode,
    responseBodySnippet: result.responseBody.substring(0, 200),
    durationMs: result.durationMs,
    errorMessage: result.errorMessage,
  };
}

// Generate demo events
export function generateDemoEvents(clientId?: string): WebhookEvent[] {
  const now = new Date();
  const events: WebhookEvent[] = [];

  const demoEvents: Array<{
    eventType: EventType;
    payload: Record<string, unknown>;
    sourceModule: string;
  }> = [
    {
      eventType: 'invoice.paid',
      payload: {
        invoiceId: 'inv_demo1',
        amount: 25000,
        currency: 'USD',
        paidAt: now.toISOString(),
      },
      sourceModule: 'billing',
    },
    {
      eventType: 'approval.approved',
      payload: {
        approvalId: 'apr_demo1',
        taskId: 'task_demo1',
        approvedBy: 'user_admin',
        approvedAt: now.toISOString(),
      },
      sourceModule: 'workflow',
    },
    {
      eventType: 'document.uploaded',
      payload: {
        documentId: 'doc_demo1',
        filename: 'Q4_Statement.pdf',
        size: 1048576,
        uploadedBy: 'user_advisor',
      },
      sourceModule: 'documents',
    },
    {
      eventType: 'sync.failed',
      payload: {
        syncJobId: 'sync_demo1',
        connector: 'custodian_a',
        error: 'Connection timeout',
        failedAt: now.toISOString(),
      },
      sourceModule: 'integrations',
    },
    {
      eventType: 'risk.breach',
      payload: {
        breachId: 'breach_demo1',
        policyId: 'ips_001',
        metric: 'equity_allocation',
        threshold: 60,
        actual: 67,
        severity: 'warning',
      },
      sourceModule: 'risk',
    },
  ];

  for (const demo of demoEvents) {
    events.push({
      id: generateId('evt'),
      clientId,
      eventType: demo.eventType,
      payload: demo.payload,
      scopeType: 'global',
      sourceModule: demo.sourceModule,
      createdAt: now.toISOString(),
    });
  }

  return events;
}

// Create test delivery for a webhook
export function createTestDelivery(webhook: Webhook): {
  event: WebhookEvent;
  delivery: WebhookDelivery;
} {
  const now = new Date().toISOString();
  const eventType = webhook.eventTypes[0] || 'invoice.paid';

  const event: WebhookEvent = {
    id: generateId('evt'),
    clientId: webhook.clientId,
    eventType,
    payload: {
      test: true,
      message: 'This is a test event',
      timestamp: now,
    },
    scopeType: webhook.scopeType,
    scopeId: webhook.scopeId,
    sourceModule: 'api',
    sourceRecordId: webhook.id,
    createdAt: now,
  };

  const delivery: WebhookDelivery = {
    id: generateId('dlv'),
    clientId: webhook.clientId,
    webhookId: webhook.id,
    eventId: event.id,
    status: 'pending',
    attempts: 0,
    maxAttempts: MAX_RETRY_ATTEMPTS,
    createdAt: now,
  };

  return { event, delivery };
}

// Simulate immediate retry
export function retryDeliveryNow(delivery: WebhookDelivery): WebhookDelivery {
  return processDelivery({
    ...delivery,
    status: 'retrying',
    nextRetryAt: undefined,
  });
}

// Mark delivery as dead
export function markDeliveryDead(delivery: WebhookDelivery): WebhookDelivery {
  return {
    ...delivery,
    status: 'dead',
    completedAt: new Date().toISOString(),
    nextRetryAt: undefined,
    errorMessage: 'Manually marked as dead letter',
  };
}

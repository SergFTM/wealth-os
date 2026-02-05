/**
 * Webhook Dispatcher Engine
 * Creates deliveries for matching webhooks when events occur
 */

import { Webhook, EventType } from '../schema/webhook';
import { WebhookEvent } from '../schema/webhookEvent';
import { WebhookDelivery, MAX_RETRY_ATTEMPTS } from '../schema/webhookDelivery';
import { generateId } from './apiAuth';

// Find webhooks that should receive an event
export function findMatchingWebhooks(
  event: WebhookEvent,
  webhooks: Webhook[]
): Webhook[] {
  return webhooks.filter((webhook) => {
    // Must be active
    if (webhook.status !== 'active') return false;

    // Must subscribe to event type
    if (!webhook.eventTypes.includes(event.eventType)) return false;

    // Check scope match
    if (webhook.scopeType !== 'global') {
      if (webhook.scopeType !== event.scopeType) return false;
      if (webhook.scopeId && webhook.scopeId !== event.scopeId) return false;
    }

    // Client ID match if specified
    if (webhook.clientId && event.clientId && webhook.clientId !== event.clientId) {
      return false;
    }

    return true;
  });
}

// Create delivery records for an event
export function createDeliveries(
  event: WebhookEvent,
  webhooks: Webhook[]
): WebhookDelivery[] {
  const now = new Date().toISOString();
  const matchingWebhooks = findMatchingWebhooks(event, webhooks);

  return matchingWebhooks.map((webhook) => ({
    id: generateId('dlv'),
    clientId: event.clientId,
    webhookId: webhook.id,
    eventId: event.id,
    status: 'pending' as const,
    attempts: 0,
    maxAttempts: MAX_RETRY_ATTEMPTS,
    createdAt: now,
  }));
}

// Process pending deliveries (batch)
export function getPendingDeliveries(deliveries: WebhookDelivery[]): WebhookDelivery[] {
  const now = new Date();

  return deliveries.filter((d) => {
    if (d.status === 'pending') return true;
    if (d.status === 'retrying' && d.nextRetryAt) {
      return new Date(d.nextRetryAt) <= now;
    }
    return false;
  });
}

// Build webhook payload
export function buildWebhookPayload(
  event: WebhookEvent,
  webhook: Webhook
): Record<string, unknown> {
  return {
    id: event.id,
    type: event.eventType,
    created: event.createdAt,
    data: event.payload,
    scope: {
      type: event.scopeType,
      id: event.scopeId,
    },
    source: {
      module: event.sourceModule,
      recordId: event.sourceRecordId,
    },
    webhook: {
      id: webhook.id,
      name: webhook.name,
    },
  };
}

// Calculate next retry time
export function calculateNextRetry(attempts: number): string | null {
  const backoffMinutes = [1, 5, 15, 60, 240];

  if (attempts >= MAX_RETRY_ATTEMPTS) {
    return null; // No more retries
  }

  const minutes = backoffMinutes[attempts] || 240;
  const nextRetry = new Date();
  nextRetry.setMinutes(nextRetry.getMinutes() + minutes);

  return nextRetry.toISOString();
}

// Get delivery statistics for a webhook
export function getDeliveryStats(
  webhookId: string,
  deliveries: WebhookDelivery[],
  days: number = 7
): {
  total: number;
  success: number;
  failed: number;
  pending: number;
  dead: number;
  failRate: number;
} {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const filtered = deliveries.filter(
    (d) => d.webhookId === webhookId && new Date(d.createdAt) >= cutoff
  );

  const success = filtered.filter((d) => d.status === 'success').length;
  const failed = filtered.filter((d) => d.status === 'failed').length;
  const pending = filtered.filter((d) => d.status === 'pending' || d.status === 'retrying').length;
  const dead = filtered.filter((d) => d.status === 'dead').length;
  const total = filtered.length;

  return {
    total,
    success,
    failed,
    pending,
    dead,
    failRate: total > 0 ? ((failed + dead) / total) * 100 : 0,
  };
}

// Format event type for display
export function formatEventType(eventType: EventType): string {
  return eventType.replace('.', ' → ');
}

// Group events by type
export function groupEventsByType(
  events: WebhookEvent[]
): Record<EventType, WebhookEvent[]> {
  const groups: Record<string, WebhookEvent[]> = {};

  for (const event of events) {
    if (!groups[event.eventType]) {
      groups[event.eventType] = [];
    }
    groups[event.eventType].push(event);
  }

  return groups as Record<EventType, WebhookEvent[]>;
}

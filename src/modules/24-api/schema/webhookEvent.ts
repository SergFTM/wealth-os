/**
 * Webhook Event Schema
 * Domain events that trigger webhook deliveries
 */

import { EventType } from './webhook';

export interface WebhookEvent {
  id: string;
  clientId?: string;
  eventType: EventType;
  payload: Record<string, unknown>;
  scopeType: 'global' | 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  sourceModule: string;
  sourceRecordId?: string;
  createdAt: string;
}

export interface WebhookEventCreateInput {
  eventType: EventType;
  payload: Record<string, unknown>;
  scopeType: 'global' | 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  clientId?: string;
  sourceModule: string;
  sourceRecordId?: string;
}

export interface WebhookEventFilters {
  eventType?: EventType;
  scopeType?: string;
  scopeId?: string;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
}

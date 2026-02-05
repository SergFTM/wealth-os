/**
 * Webhook Delivery Schema
 * Tracks delivery attempts for webhook events
 */

export type DeliveryStatus = 'pending' | 'success' | 'failed' | 'retrying' | 'dead';

export interface WebhookDelivery {
  id: string;
  clientId?: string;
  webhookId: string;
  eventId: string;
  status: DeliveryStatus;
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: string;
  nextRetryAt?: string;
  responseCode?: number;
  responseBodySnippet?: string;
  errorMessage?: string;
  durationMs?: number;
  createdAt: string;
  completedAt?: string;
}

export interface WebhookDeliveryCreateInput {
  webhookId: string;
  eventId: string;
  clientId?: string;
  maxAttempts?: number;
}

export interface WebhookDeliveryFilters {
  webhookId?: string;
  eventId?: string;
  status?: DeliveryStatus;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
}

export const deliveryStatusLabels: Record<DeliveryStatus, { en: string; ru: string; uk: string }> = {
  pending: { en: 'Pending', ru: 'Ожидание', uk: 'Очікування' },
  success: { en: 'Success', ru: 'Успешно', uk: 'Успішно' },
  failed: { en: 'Failed', ru: 'Ошибка', uk: 'Помилка' },
  retrying: { en: 'Retrying', ru: 'Повтор', uk: 'Повтор' },
  dead: { en: 'Dead Letter', ru: 'Dead Letter', uk: 'Dead Letter' },
};

// Retry backoff in minutes: 1, 5, 15, 60, 240
export const RETRY_BACKOFF_MINUTES = [1, 5, 15, 60, 240];
export const MAX_RETRY_ATTEMPTS = 5;

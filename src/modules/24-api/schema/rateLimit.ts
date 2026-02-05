/**
 * Rate Limit Schema
 * Rate limiting configuration and counters
 */

export type WindowKey = '1m' | '5m' | '1h' | '1d';

export interface RateLimit {
  id: string;
  clientId?: string;
  apiKeyId: string;
  windowKey: WindowKey;
  limit: number;
  used: number;
  hits: number; // Number of times limit was exceeded
  windowStart: string;
  updatedAt: string;
}

export interface RateLimitCreateInput {
  apiKeyId: string;
  windowKey: WindowKey;
  limit: number;
  clientId?: string;
}

export interface RateLimitUpdateInput {
  limit?: number;
}

export const windowKeyLabels: Record<WindowKey, { en: string; ru: string; uk: string }> = {
  '1m': { en: '1 minute', ru: '1 минута', uk: '1 хвилина' },
  '5m': { en: '5 minutes', ru: '5 минут', uk: '5 хвилин' },
  '1h': { en: '1 hour', ru: '1 час', uk: '1 година' },
  '1d': { en: '1 day', ru: '1 день', uk: '1 день' },
};

export const DEFAULT_RATE_LIMITS: Record<WindowKey, number> = {
  '1m': 60,
  '5m': 200,
  '1h': 1000,
  '1d': 10000,
};

/**
 * Rate Limiter Engine
 * Manages API rate limiting
 */

import { RateLimit, WindowKey, DEFAULT_RATE_LIMITS } from '../schema/rateLimit';
import { generateId } from './apiAuth';

// Check if request is within rate limit
export interface RateLimitCheck {
  allowed: boolean;
  remaining: number;
  resetAt: string;
  limit: number;
}

export function checkRateLimit(
  apiKeyId: string,
  rateLimits: RateLimit[],
  windowKey: WindowKey = '1m'
): RateLimitCheck {
  const limit = rateLimits.find(
    (rl) => rl.apiKeyId === apiKeyId && rl.windowKey === windowKey
  );

  if (!limit) {
    // No limit configured - allow
    return {
      allowed: true,
      remaining: DEFAULT_RATE_LIMITS[windowKey],
      resetAt: getWindowEnd(windowKey),
      limit: DEFAULT_RATE_LIMITS[windowKey],
    };
  }

  // Check if window has expired
  const windowEnd = getWindowEndFromStart(limit.windowStart, windowKey);
  const now = new Date();

  if (now > new Date(windowEnd)) {
    // Window expired - would reset
    return {
      allowed: true,
      remaining: limit.limit,
      resetAt: getWindowEnd(windowKey),
      limit: limit.limit,
    };
  }

  const remaining = Math.max(0, limit.limit - limit.used);

  return {
    allowed: remaining > 0,
    remaining,
    resetAt: windowEnd,
    limit: limit.limit,
  };
}

// Increment rate limit counter
export function incrementRateLimit(
  apiKeyId: string,
  rateLimits: RateLimit[],
  windowKey: WindowKey = '1m',
  clientId?: string
): RateLimit {
  const now = new Date();
  const existing = rateLimits.find(
    (rl) => rl.apiKeyId === apiKeyId && rl.windowKey === windowKey
  );

  if (existing) {
    // Check if window expired
    const windowEnd = getWindowEndFromStart(existing.windowStart, windowKey);

    if (now > new Date(windowEnd)) {
      // Reset window
      return {
        ...existing,
        used: 1,
        hits: existing.hits,
        windowStart: now.toISOString(),
        updatedAt: now.toISOString(),
      };
    }

    // Increment counter
    const newUsed = existing.used + 1;
    const hitLimit = newUsed > existing.limit;

    return {
      ...existing,
      used: newUsed,
      hits: hitLimit ? existing.hits + 1 : existing.hits,
      updatedAt: now.toISOString(),
    };
  }

  // Create new rate limit record
  return {
    id: generateId('rl'),
    clientId,
    apiKeyId,
    windowKey,
    limit: DEFAULT_RATE_LIMITS[windowKey],
    used: 1,
    hits: 0,
    windowStart: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

// Get window end time
export function getWindowEnd(windowKey: WindowKey): string {
  const now = new Date();

  switch (windowKey) {
    case '1m':
      now.setMinutes(now.getMinutes() + 1);
      break;
    case '5m':
      now.setMinutes(now.getMinutes() + 5);
      break;
    case '1h':
      now.setHours(now.getHours() + 1);
      break;
    case '1d':
      now.setDate(now.getDate() + 1);
      break;
  }

  return now.toISOString();
}

// Get window end from start time
export function getWindowEndFromStart(windowStart: string, windowKey: WindowKey): string {
  const start = new Date(windowStart);

  switch (windowKey) {
    case '1m':
      start.setMinutes(start.getMinutes() + 1);
      break;
    case '5m':
      start.setMinutes(start.getMinutes() + 5);
      break;
    case '1h':
      start.setHours(start.getHours() + 1);
      break;
    case '1d':
      start.setDate(start.getDate() + 1);
      break;
  }

  return start.toISOString();
}

// Get rate limit usage percentage
export function getUsagePercentage(rateLimit: RateLimit): number {
  if (rateLimit.limit === 0) return 100;
  return Math.min(100, (rateLimit.used / rateLimit.limit) * 100);
}

// Get rate limit status
export function getRateLimitStatus(rateLimit: RateLimit): 'ok' | 'warning' | 'critical' {
  const usage = getUsagePercentage(rateLimit);

  if (usage >= 100) return 'critical';
  if (usage >= 80) return 'warning';
  return 'ok';
}

// Reset rate limit counters (for demo)
export function resetRateLimits(
  apiKeyId: string,
  rateLimits: RateLimit[]
): RateLimit[] {
  const now = new Date().toISOString();

  return rateLimits.map((rl) => {
    if (rl.apiKeyId === apiKeyId) {
      return {
        ...rl,
        used: 0,
        windowStart: now,
        updatedAt: now,
      };
    }
    return rl;
  });
}

// Create default rate limits for new API key
export function createDefaultRateLimits(
  apiKeyId: string,
  clientId?: string
): RateLimit[] {
  const now = new Date().toISOString();
  const windows: WindowKey[] = ['1m', '1h'];

  return windows.map((windowKey) => ({
    id: generateId('rl'),
    clientId,
    apiKeyId,
    windowKey,
    limit: DEFAULT_RATE_LIMITS[windowKey],
    used: 0,
    hits: 0,
    windowStart: now,
    updatedAt: now,
  }));
}

// Get rate limit summary for display
export function getRateLimitSummary(rateLimits: RateLimit[]): {
  totalHits24h: number;
  keysAtLimit: number;
  highestUsage: number;
} {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recent = rateLimits.filter((rl) => new Date(rl.updatedAt) >= dayAgo);

  const totalHits24h = recent.reduce((sum, rl) => sum + rl.hits, 0);
  const keysAtLimit = recent.filter((rl) => rl.used >= rl.limit).length;
  const highestUsage = Math.max(...recent.map(getUsagePercentage), 0);

  return {
    totalHits24h,
    keysAtLimit,
    highestUsage,
  };
}

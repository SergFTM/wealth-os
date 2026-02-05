/**
 * API Authentication Engine
 * Handles API key validation and authentication
 */

import { ApiKey } from '../schema/apiKey';
import { ApiKeyScope } from '../schema/apiKeyScope';

// Simple hash function for demo (in production use bcrypt/argon2)
export function hashSecret(secret: string): string {
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    const char = secret.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// Generate a new API key secret
export function generateApiKeySecret(): { secret: string; hash: string; prefix: string } {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secret = 'wos_';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return {
    secret,
    hash: hashSecret(secret),
    prefix: secret.substring(0, 12),
  };
}

// Validate API key from header
export interface AuthResult {
  valid: boolean;
  error?: string;
  errorCode?: number;
  apiKey?: ApiKey;
  scopes?: ApiKeyScope[];
}

export function validateApiKey(
  apiKeyHeader: string | null,
  apiKeys: ApiKey[],
  apiKeyScopes: ApiKeyScope[]
): AuthResult {
  if (!apiKeyHeader) {
    return {
      valid: false,
      error: 'Missing x-api-key header',
      errorCode: 401,
    };
  }

  const secretHash = hashSecret(apiKeyHeader);
  const apiKey = apiKeys.find((k) => k.secretHash === secretHash);

  if (!apiKey) {
    return {
      valid: false,
      error: 'Invalid API key',
      errorCode: 401,
    };
  }

  if (apiKey.status !== 'active') {
    return {
      valid: false,
      error: `API key is ${apiKey.status}`,
      errorCode: 401,
    };
  }

  const now = new Date();
  const expiresAt = new Date(apiKey.expiresAt);
  if (now > expiresAt) {
    return {
      valid: false,
      error: 'API key has expired',
      errorCode: 401,
    };
  }

  const scopes = apiKeyScopes.filter((s) => s.apiKeyId === apiKey.id);

  return {
    valid: true,
    apiKey,
    scopes,
  };
}

// Check if API key has required scope
export function hasScope(
  scopes: ApiKeyScope[],
  moduleKey: string,
  actionKey: string,
  scopeType?: string,
  scopeId?: string
): boolean {
  return scopes.some((scope) => {
    if (scope.moduleKey !== moduleKey) return false;
    if (scope.actionKey !== actionKey) return false;

    // Global scope grants access to everything
    if (scope.scopeType === 'global') return true;

    // Check scope type and ID match
    if (scopeType && scope.scopeType !== scopeType) return false;
    if (scopeId && scope.scopeId && scope.scopeId !== scopeId) return false;

    return true;
  });
}

// Filter data for client-safe keys
export function filterClientSafeData<T extends Record<string, unknown>>(
  data: T[],
  clientSafe: boolean
): T[] {
  if (!clientSafe) return data;

  return data.map((item) => {
    const filtered = { ...item };
    // Remove internal fields
    delete filtered.internalNotes;
    delete filtered.staffNotes;
    delete filtered.auditId;
    delete filtered.staffOnly;
    delete filtered.adminOnly;
    return filtered;
  });
}

// Mask URL for display
export function maskUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}/***`;
  } catch {
    return '***';
  }
}

// Generate unique ID
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

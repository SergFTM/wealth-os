/**
 * API Key Schema
 * Represents an API key for external access
 */

export type KeyMode = 'server' | 'advisor' | 'client';
export type KeyStatus = 'active' | 'revoked' | 'rotated' | 'expired';

export interface ApiKey {
  id: string;
  clientId?: string;
  name: string;
  ownerUserId: string;
  keyMode: KeyMode;
  secretHash: string;
  keyPrefix: string; // First 8 chars for identification
  createdAt: string;
  expiresAt: string;
  status: KeyStatus;
  lastUsedAt?: string;
  rotatedFromId?: string;
  revokedAt?: string;
  revokedBy?: string;
  notes?: string;
}

export interface ApiKeyCreateInput {
  name: string;
  ownerUserId: string;
  keyMode: KeyMode;
  expiresAt: string;
  clientId?: string;
  notes?: string;
}

export interface ApiKeyUpdateInput {
  name?: string;
  notes?: string;
  expiresAt?: string;
}

export interface ApiKeyFilters {
  status?: KeyStatus;
  keyMode?: KeyMode;
  clientId?: string;
  ownerUserId?: string;
  search?: string;
}

export const keyModeLabels: Record<KeyMode, { en: string; ru: string; uk: string }> = {
  server: { en: 'Server', ru: 'Серверный', uk: 'Серверний' },
  advisor: { en: 'Advisor', ru: 'Консультант', uk: 'Консультант' },
  client: { en: 'Client', ru: 'Клиентский', uk: 'Клієнтський' },
};

export const keyStatusLabels: Record<KeyStatus, { en: string; ru: string; uk: string }> = {
  active: { en: 'Active', ru: 'Активен', uk: 'Активний' },
  revoked: { en: 'Revoked', ru: 'Отозван', uk: 'Відкликано' },
  rotated: { en: 'Rotated', ru: 'Ротирован', uk: 'Ротовано' },
  expired: { en: 'Expired', ru: 'Истек', uk: 'Закінчився' },
};

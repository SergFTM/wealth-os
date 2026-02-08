// Client-safe access enforcement for portal
// All portal queries MUST pass through these filters

import { Locale } from '@/lib/i18n';

export interface ClientSafeFilter {
  clientSafe: true;
  sharedToPortal?: boolean;
  published?: boolean;
  householdId?: string;
  clientId?: string;
}

export function enforceClientSafe<T extends Record<string, unknown>>(
  items: T[],
  filter: ClientSafeFilter
): T[] {
  return items.filter(item => {
    // Must be client-safe published
    if (filter.sharedToPortal && !item.sharedToPortal && !item.clientSafePublished) {
      return false;
    }
    if (filter.published && !item.published && item.statusKey !== 'published') {
      return false;
    }
    // Scope to household if provided
    if (filter.householdId && item.householdId && item.householdId !== filter.householdId) {
      return false;
    }
    // Scope to client if provided
    if (filter.clientId && item.clientId && item.clientId !== filter.clientId) {
      return false;
    }
    return true;
  });
}

export function stripInternalFields<T extends Record<string, unknown>>(item: T): Partial<T> {
  const internal = [
    'internalNotes', 'staffComments', 'adminFlags',
    'complianceNotes', 'riskNotes', 'auditInternal',
    'costBasis', 'taxLotId', 'marginDetails'
  ];
  const result = { ...item };
  for (const key of internal) {
    delete result[key];
  }
  return result;
}

export function getLocalizedBody(
  item: { bodyMdRu?: string; bodyMdEn?: string; bodyMdUk?: string },
  locale: Locale
): string {
  switch (locale) {
    case 'en': return item.bodyMdEn || item.bodyMdRu || '';
    case 'uk': return item.bodyMdUk || item.bodyMdRu || '';
    default: return item.bodyMdRu || '';
  }
}

export const PORTAL_SECTIONS = [
  'net-worth', 'performance', 'documents', 'packs',
  'ownership', 'philanthropy', 'relationships',
  'requests', 'consent', 'messages', 'audit'
] as const;

export type PortalSection = typeof PORTAL_SECTIONS[number];

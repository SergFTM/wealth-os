/**
 * Client-Safe Enforcer — helper functions for filtering and masking data
 * Used across modules to enforce client-safe access and consent restrictions
 */

import type { ConsentRecord } from './types';
import { isConsentActive } from './consentEngine';

interface FieldMaskRule {
  field: string;
  maskType: 'redact' | 'truncate' | 'hash' | 'hide';
}

/**
 * Filter fields from a record based on client-safe rules
 */
export function filterClientSafeFields<T extends Record<string, unknown>>(
  record: T,
  hiddenFields: string[] = ['costBasis', 'taxLots', 'internalNotes', 'feeSchedule']
): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(record)) {
    if (!hiddenFields.includes(key)) {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  return result;
}

/**
 * Apply masking rules to a record
 */
export function applyMaskRules<T extends Record<string, unknown>>(
  record: T,
  rules: FieldMaskRule[]
): T {
  const result = { ...record };

  for (const rule of rules) {
    if (!(rule.field in result)) continue;

    const value = result[rule.field];
    if (typeof value !== 'string') continue;

    switch (rule.maskType) {
      case 'redact':
        (result as Record<string, unknown>)[rule.field] = '***REDACTED***';
        break;
      case 'truncate':
        (result as Record<string, unknown>)[rule.field] = value.slice(0, 3) + '***';
        break;
      case 'hash':
        (result as Record<string, unknown>)[rule.field] = `#${value.length}chars`;
        break;
      case 'hide':
        delete (result as Record<string, unknown>)[rule.field];
        break;
    }
  }

  return result;
}

/**
 * Check if a grantee can access a specific module
 */
export function canAccessModule(
  consents: ConsentRecord[],
  granteeId: string,
  moduleSlug: string
): boolean {
  return consents.some(c => {
    if (c.granteeRefJson.id !== granteeId) return false;
    if (!isConsentActive(c)) return false;
    const modules = c.scopeJson.modulesJson || [];
    return modules.length === 0 || modules.includes(moduleSlug);
  });
}

/**
 * Check if a grantee can access a specific document
 */
export function canAccessDocument(
  consents: ConsentRecord[],
  granteeId: string,
  docId: string
): boolean {
  return consents.some(c => {
    if (c.granteeRefJson.id !== granteeId) return false;
    if (!isConsentActive(c)) return false;
    const docIds = c.scopeJson.docIdsJson || [];
    return docIds.length === 0 || docIds.includes(docId);
  });
}

/**
 * Check if a grantee can download (vs view only)
 */
export function canDownload(
  consents: ConsentRecord[],
  granteeId: string
): boolean {
  return consents.some(c => {
    if (c.granteeRefJson.id !== granteeId) return false;
    if (!isConsentActive(c)) return false;
    return c.restrictionsJson.allowDownload;
  });
}

/**
 * Filter pack items based on consent scope
 */
export function filterPackItems<T extends { id: string }>(
  items: T[],
  consents: ConsentRecord[],
  granteeId: string
): T[] {
  const allowedPacks = new Set<string>();

  for (const c of consents) {
    if (c.granteeRefJson.id !== granteeId) continue;
    if (!isConsentActive(c)) continue;
    const packIds = c.scopeJson.packIdsJson || [];
    if (packIds.length === 0) {
      return items; // No pack restrictions — allow all
    }
    for (const pid of packIds) allowedPacks.add(pid);
  }

  if (allowedPacks.size === 0) return [];
  return items.filter(item => allowedPacks.has(item.id));
}

/**
 * Get the most restrictive consent configuration for a grantee
 */
export function getMostRestrictive(
  consents: ConsentRecord[],
  granteeId: string
): { viewOnly: boolean; allowDownload: boolean; clientSafe: boolean } {
  const active = consents.filter(
    c => c.granteeRefJson.id === granteeId && isConsentActive(c)
  );

  if (active.length === 0) {
    return { viewOnly: true, allowDownload: false, clientSafe: true };
  }

  return {
    viewOnly: active.every(c => c.restrictionsJson.viewOnly),
    allowDownload: active.some(c => c.restrictionsJson.allowDownload),
    clientSafe: active.some(c => c.restrictionsJson.clientSafe),
  };
}

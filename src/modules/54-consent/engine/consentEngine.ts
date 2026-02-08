/**
 * Consent Engine — create, update, revoke consents and compute derived permissions
 */

import type { ConsentRecord, DerivedPermission } from './types';

export function isConsentActive(consent: ConsentRecord): boolean {
  if (consent.statusKey !== 'active') return false;
  const now = new Date();
  if (consent.effectiveTo && new Date(consent.effectiveTo) < now) return false;
  if (new Date(consent.effectiveFrom) > now) return false;
  return true;
}

export function isConsentExpiring(consent: ConsentRecord, withinDays: number = 30): boolean {
  if (!consent.effectiveTo) return false;
  const now = new Date();
  const expiry = new Date(consent.effectiveTo);
  const threshold = new Date(now);
  threshold.setDate(threshold.getDate() + withinDays);
  return consent.statusKey === 'active' && expiry <= threshold && expiry >= now;
}

export function buildRevokePayload(userId: string) {
  return {
    statusKey: 'revoked' as const,
    revokedByUserId: userId,
    revokedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function buildConsentPayload(
  data: Partial<ConsentRecord> & {
    clientId: string;
    grantorRefJson: ConsentRecord['grantorRefJson'];
    granteeRefJson: ConsentRecord['granteeRefJson'];
    purposeKey: ConsentRecord['purposeKey'];
    createdByUserId: string;
  }
): Omit<ConsentRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: data.clientId,
    grantorRefJson: data.grantorRefJson,
    granteeRefJson: data.granteeRefJson,
    purposeKey: data.purposeKey,
    scopeJson: data.scopeJson || {},
    restrictionsJson: data.restrictionsJson || {
      viewOnly: true,
      allowDownload: false,
      clientSafe: false,
    },
    effectiveFrom: data.effectiveFrom || new Date().toISOString().split('T')[0],
    effectiveTo: data.effectiveTo,
    statusKey: 'active',
    evidenceDocIdsJson: data.evidenceDocIdsJson || [],
    createdByUserId: data.createdByUserId,
  };
}

export function computeDerivedPermissions(consents: ConsentRecord[]): DerivedPermission[] {
  const map = new Map<string, DerivedPermission>();

  for (const c of consents) {
    if (!isConsentActive(c)) continue;

    const key = c.granteeRefJson.id;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        granteeId: c.granteeRefJson.id,
        granteeLabel: c.granteeRefJson.label,
        modules: [...(c.scopeJson.modulesJson || [])],
        entityIds: [...(c.scopeJson.entityIdsJson || [])],
        docIds: [...(c.scopeJson.docIdsJson || [])],
        packIds: [...(c.scopeJson.packIdsJson || [])],
        viewOnly: c.restrictionsJson.viewOnly,
        allowDownload: c.restrictionsJson.allowDownload,
        clientSafe: c.restrictionsJson.clientSafe,
        consentIds: [c.id],
      });
    } else {
      // Merge scopes
      for (const m of c.scopeJson.modulesJson || []) {
        if (!existing.modules.includes(m)) existing.modules.push(m);
      }
      for (const e of c.scopeJson.entityIdsJson || []) {
        if (!existing.entityIds.includes(e)) existing.entityIds.push(e);
      }
      for (const d of c.scopeJson.docIdsJson || []) {
        if (!existing.docIds.includes(d)) existing.docIds.push(d);
      }
      for (const p of c.scopeJson.packIdsJson || []) {
        if (!existing.packIds.includes(p)) existing.packIds.push(p);
      }
      // Least restrictive wins for access
      if (!c.restrictionsJson.viewOnly) existing.viewOnly = false;
      if (c.restrictionsJson.allowDownload) existing.allowDownload = true;
      if (c.restrictionsJson.clientSafe) existing.clientSafe = true;
      existing.consentIds.push(c.id);
    }
  }

  return Array.from(map.values());
}

export function getGranteeConsents(consents: ConsentRecord[], granteeId: string): ConsentRecord[] {
  return consents.filter(c => c.granteeRefJson.id === granteeId && isConsentActive(c));
}

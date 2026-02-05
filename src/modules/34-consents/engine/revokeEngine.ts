/**
 * Revoke Engine - handles consent revocation
 */

import { Consent } from './consentEngine';

export interface Revocation {
  id: string;
  clientId: string;
  consentId: string;
  subjectType?: string;
  subjectId?: string;
  subjectName?: string;
  scopeType?: string;
  scopeId?: string;
  scopeName?: string;
  revokedByUserId: string;
  revokedByName?: string;
  reason: string;
  revokedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevokeConsentInput {
  consent: Consent;
  revokedByUserId: string;
  revokedByName?: string;
  reason: string;
}

export function generateRevocationId(): string {
  return `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function revokeConsent(input: RevokeConsentInput): {
  revocation: Omit<Revocation, 'id' | 'createdAt' | 'updatedAt'>;
  consentPatch: Partial<Consent>;
} {
  const now = new Date().toISOString();

  const revocation: Omit<Revocation, 'id' | 'createdAt' | 'updatedAt'> = {
    clientId: input.consent.clientId,
    consentId: input.consent.id,
    subjectType: input.consent.subjectType,
    subjectId: input.consent.subjectId,
    subjectName: input.consent.subjectName,
    scopeType: input.consent.scopeType,
    scopeId: input.consent.scopeId,
    scopeName: input.consent.scopeName,
    revokedByUserId: input.revokedByUserId,
    revokedByName: input.revokedByName,
    reason: input.reason,
    revokedAt: now,
  };

  const consentPatch: Partial<Consent> = {
    status: 'revoked',
    updatedAt: now,
  };

  return { revocation, consentPatch };
}

export function getRevocationsForConsent(
  revocations: Revocation[],
  consentId: string
): Revocation[] {
  return revocations.filter(r => r.consentId === consentId);
}

export function getRevocationsForSubject(
  revocations: Revocation[],
  subjectType: string,
  subjectId: string
): Revocation[] {
  return revocations.filter(r =>
    r.subjectType === subjectType &&
    r.subjectId === subjectId
  );
}

export function getRecentRevocations(
  revocations: Revocation[],
  days: number = 30
): Revocation[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return revocations.filter(r =>
    new Date(r.revokedAt) >= cutoff
  );
}

export function canRevokeConsent(consent: Consent): boolean {
  return consent.status === 'active';
}

export interface BulkRevokeResult {
  successful: string[];
  failed: { consentId: string; reason: string }[];
}

export function validateBulkRevoke(
  consents: Consent[],
  consentIds: string[]
): BulkRevokeResult {
  const result: BulkRevokeResult = {
    successful: [],
    failed: [],
  };

  for (const id of consentIds) {
    const consent = consents.find(c => c.id === id);

    if (!consent) {
      result.failed.push({ consentId: id, reason: 'Consent not found' });
      continue;
    }

    if (!canRevokeConsent(consent)) {
      result.failed.push({
        consentId: id,
        reason: `Cannot revoke consent with status "${consent.status}"`
      });
      continue;
    }

    result.successful.push(id);
  }

  return result;
}

/**
 * Consent Engine - manages consent lifecycle
 */

export interface Consent {
  id: string;
  clientId: string;
  subjectType: 'user' | 'advisor' | 'client';
  subjectId: string;
  subjectName?: string;
  scopeType: 'household' | 'entity' | 'account' | 'document' | 'report';
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafe: boolean;
  validFrom: string;
  validUntil?: string;
  status: 'active' | 'expired' | 'revoked';
  grantedByUserId?: string;
  grantedByName?: string;
  reason?: string;
  requestId?: string;
  watermarkRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsentInput {
  clientId: string;
  subjectType: 'user' | 'advisor' | 'client';
  subjectId: string;
  subjectName?: string;
  scopeType: 'household' | 'entity' | 'account' | 'document' | 'report';
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafe?: boolean;
  validFrom?: string;
  validUntil?: string;
  grantedByUserId: string;
  grantedByName?: string;
  reason?: string;
  requestId?: string;
  watermarkRequired?: boolean;
}

export function generateConsentId(): string {
  return `consent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createConsent(input: CreateConsentInput): Omit<Consent, 'id' | 'createdAt' | 'updatedAt'> {
  const now = new Date().toISOString();
  return {
    clientId: input.clientId,
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    subjectName: input.subjectName,
    scopeType: input.scopeType,
    scopeId: input.scopeId,
    scopeName: input.scopeName,
    permissions: input.permissions,
    clientSafe: input.clientSafe ?? false,
    validFrom: input.validFrom ?? now,
    validUntil: input.validUntil,
    status: 'active',
    grantedByUserId: input.grantedByUserId,
    grantedByName: input.grantedByName,
    reason: input.reason,
    requestId: input.requestId,
    watermarkRequired: input.watermarkRequired ?? false,
  };
}

export function isConsentExpired(consent: Consent): boolean {
  if (!consent.validUntil) return false;
  return new Date(consent.validUntil) < new Date();
}

export function isConsentActive(consent: Consent): boolean {
  if (consent.status !== 'active') return false;
  if (isConsentExpired(consent)) return false;
  const now = new Date();
  const validFrom = new Date(consent.validFrom);
  return now >= validFrom;
}

export function extendConsent(consent: Consent, newValidUntil: string): Partial<Consent> {
  return {
    validUntil: newValidUntil,
    status: 'active',
    updatedAt: new Date().toISOString(),
  };
}

export function getConsentsExpiringSoon(consents: Consent[], days: number = 30): Consent[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return consents.filter(c => {
    if (c.status !== 'active' || !c.validUntil) return false;
    const expiryDate = new Date(c.validUntil);
    return expiryDate > now && expiryDate <= futureDate;
  });
}

export function checkAutoExpire(consents: Consent[]): Consent[] {
  const now = new Date();
  return consents.filter(c => {
    if (c.status !== 'active' || !c.validUntil) return false;
    return new Date(c.validUntil) < now;
  });
}

export function hasPermission(consent: Consent, permission: string): boolean {
  return isConsentActive(consent) && consent.permissions.includes(permission);
}

export function filterConsentsByScope(
  consents: Consent[],
  scopeType: string,
  scopeId?: string
): Consent[] {
  return consents.filter(c => {
    if (c.scopeType !== scopeType) return false;
    if (scopeId && c.scopeId !== scopeId) return false;
    return isConsentActive(c);
  });
}

export function filterConsentsBySubject(
  consents: Consent[],
  subjectType: string,
  subjectId: string
): Consent[] {
  return consents.filter(c =>
    c.subjectType === subjectType &&
    c.subjectId === subjectId &&
    isConsentActive(c)
  );
}

/**
 * Review Engine — generate access review snapshots and track decisions
 */

import type { AccessReview, ConsentRecord } from './types';
import { computeDerivedPermissions, isConsentActive } from './consentEngine';

export function generateReviewSnapshot(
  consents: ConsentRecord[]
): AccessReview['snapshotJson'] {
  const derived = computeDerivedPermissions(consents.filter(isConsentActive));

  return {
    grantees: derived.map(d => ({
      granteeId: d.granteeId,
      granteeLabel: d.granteeLabel,
      granteeType: 'user',
      permissions: [
        ...d.modules.map(m => `module:${m}`),
        ...d.entityIds.map(e => `entity:${e}`),
        ...d.docIds.map(d => `doc:${d}`),
        ...d.packIds.map(p => `pack:${p}`),
        d.viewOnly ? 'restriction:viewOnly' : 'restriction:fullAccess',
        d.allowDownload ? 'restriction:download' : '',
        d.clientSafe ? 'restriction:clientSafe' : '',
      ].filter(Boolean),
      consentIds: d.consentIds,
    })),
  };
}

export function buildReviewPayload(
  data: Pick<AccessReview, 'clientId' | 'name' | 'dueAt'> & {
    scopeHouseholdId?: string;
  },
  consents: ConsentRecord[]
): Omit<AccessReview, 'id' | 'createdAt'> {
  return {
    clientId: data.clientId,
    name: data.name,
    scopeHouseholdId: data.scopeHouseholdId,
    statusKey: 'open',
    dueAt: data.dueAt,
    startedAt: new Date().toISOString(),
    snapshotJson: generateReviewSnapshot(consents),
    decisionsJson: [],
  };
}

export function addDecision(
  review: AccessReview,
  granteeId: string,
  action: 'confirm' | 'revoke' | 'restrict',
  notes?: string
): AccessReview['decisionsJson'] {
  const decisions = [...(review.decisionsJson || [])];
  const existing = decisions.findIndex(d => d.granteeId === granteeId);
  const decision = { granteeId, action, notes };

  if (existing >= 0) {
    decisions[existing] = decision;
  } else {
    decisions.push(decision);
  }

  return decisions;
}

export function closeReview(review: AccessReview) {
  return {
    statusKey: 'closed' as const,
    closedAt: new Date().toISOString(),
  };
}

export function getDueReviews(reviews: AccessReview[]): AccessReview[] {
  const now = new Date();
  return reviews.filter(r => {
    if (r.statusKey !== 'open') return false;
    return new Date(r.dueAt) <= now;
  });
}

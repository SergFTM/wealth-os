/**
 * Request Engine — manage DSAR-like and access requests
 */

import type { ConsentRequest } from './types';

export function buildRequestPayload(
  data: Pick<ConsentRequest, 'clientId' | 'requesterRefJson' | 'requestTypeKey' | 'scopeJson'> & {
    dueAt?: string;
  }
): Omit<ConsentRequest, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: data.clientId,
    requesterRefJson: data.requesterRefJson,
    requestTypeKey: data.requestTypeKey,
    scopeJson: data.scopeJson,
    statusKey: 'pending',
    dueAt: data.dueAt,
  };
}

export function buildApprovePayload(notes?: string) {
  return {
    statusKey: 'approved' as const,
    decisionNotes: notes || 'Approved',
    updatedAt: new Date().toISOString(),
  };
}

export function buildRejectPayload(notes?: string) {
  return {
    statusKey: 'rejected' as const,
    decisionNotes: notes || 'Rejected',
    updatedAt: new Date().toISOString(),
  };
}

export function buildFulfillPayload() {
  return {
    statusKey: 'fulfilled' as const,
    fulfilledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getPendingRequests(requests: ConsentRequest[]): ConsentRequest[] {
  return requests.filter(r => r.statusKey === 'pending');
}

export function getOverdueRequests(requests: ConsentRequest[]): ConsentRequest[] {
  const now = new Date();
  return requests.filter(r => {
    if (r.statusKey !== 'pending' || !r.dueAt) return false;
    return new Date(r.dueAt) < now;
  });
}

export function getRequestsByType(
  requests: ConsentRequest[],
  type: ConsentRequest['requestTypeKey']
): ConsentRequest[] {
  return requests.filter(r => r.requestTypeKey === type);
}

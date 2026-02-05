/**
 * Request Flow Engine - handles access request lifecycle
 */

import { CreateConsentInput } from './consentEngine';

export interface AccessRequest {
  id: string;
  clientId: string;
  requestedBySubjectType: 'user' | 'advisor' | 'client';
  requestedById: string;
  requestedByName?: string;
  scopeType: 'household' | 'entity' | 'account' | 'document' | 'report';
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafeRequested: boolean;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  slaDueAt?: string;
  decidedByUserId?: string;
  decidedByName?: string;
  decidedAt?: string;
  decisionNotes?: string;
  consentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestInput {
  clientId: string;
  requestedBySubjectType: 'user' | 'advisor' | 'client';
  requestedById: string;
  requestedByName?: string;
  scopeType: 'household' | 'entity' | 'account' | 'document' | 'report';
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafeRequested?: boolean;
  reason: string;
  slaDays?: number;
}

export interface ApproveRequestInput {
  decidedByUserId: string;
  decidedByName?: string;
  decisionNotes?: string;
  validUntil?: string;
  watermarkRequired?: boolean;
}

export interface RejectRequestInput {
  decidedByUserId: string;
  decidedByName?: string;
  decisionNotes: string;
}

export function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createRequest(input: CreateRequestInput): Omit<AccessRequest, 'id' | 'createdAt' | 'updatedAt'> {
  const now = new Date();
  const slaDays = input.slaDays ?? 5;
  const slaDue = new Date(now.getTime() + slaDays * 24 * 60 * 60 * 1000);

  return {
    clientId: input.clientId,
    requestedBySubjectType: input.requestedBySubjectType,
    requestedById: input.requestedById,
    requestedByName: input.requestedByName,
    scopeType: input.scopeType,
    scopeId: input.scopeId,
    scopeName: input.scopeName,
    permissions: input.permissions,
    clientSafeRequested: input.clientSafeRequested ?? false,
    reason: input.reason,
    status: 'pending',
    slaDueAt: slaDue.toISOString(),
  };
}

export function approveRequest(
  request: AccessRequest,
  input: ApproveRequestInput
): { requestPatch: Partial<AccessRequest>; consentInput: CreateConsentInput } {
  const now = new Date().toISOString();

  const requestPatch: Partial<AccessRequest> = {
    status: 'approved',
    decidedByUserId: input.decidedByUserId,
    decidedByName: input.decidedByName,
    decidedAt: now,
    decisionNotes: input.decisionNotes,
    updatedAt: now,
  };

  const consentInput: CreateConsentInput = {
    clientId: request.clientId,
    subjectType: request.requestedBySubjectType,
    subjectId: request.requestedById,
    subjectName: request.requestedByName,
    scopeType: request.scopeType,
    scopeId: request.scopeId,
    scopeName: request.scopeName,
    permissions: request.permissions,
    clientSafe: request.clientSafeRequested,
    validUntil: input.validUntil,
    grantedByUserId: input.decidedByUserId,
    grantedByName: input.decidedByName,
    reason: `Approved request: ${request.reason}`,
    requestId: request.id,
    watermarkRequired: input.watermarkRequired,
  };

  return { requestPatch, consentInput };
}

export function rejectRequest(
  request: AccessRequest,
  input: RejectRequestInput
): Partial<AccessRequest> {
  const now = new Date().toISOString();

  return {
    status: 'rejected',
    decidedByUserId: input.decidedByUserId,
    decidedByName: input.decidedByName,
    decidedAt: now,
    decisionNotes: input.decisionNotes,
    updatedAt: now,
  };
}

export function isRequestOverdue(request: AccessRequest): boolean {
  if (request.status !== 'pending' || !request.slaDueAt) return false;
  return new Date(request.slaDueAt) < new Date();
}

export function getRequestsAtRisk(requests: AccessRequest[], hoursBeforeDue: number = 24): AccessRequest[] {
  const now = new Date();
  const threshold = new Date(now.getTime() + hoursBeforeDue * 60 * 60 * 1000);

  return requests.filter(r => {
    if (r.status !== 'pending' || !r.slaDueAt) return false;
    const dueDate = new Date(r.slaDueAt);
    return dueDate > now && dueDate <= threshold;
  });
}

export function getPendingRequests(requests: AccessRequest[]): AccessRequest[] {
  return requests.filter(r => r.status === 'pending');
}

export function getRequestsByStatus(requests: AccessRequest[], status: string): AccessRequest[] {
  return requests.filter(r => r.status === status);
}

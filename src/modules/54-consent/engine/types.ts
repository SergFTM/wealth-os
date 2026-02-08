/**
 * Consent & Privacy Center Types
 */

export interface ConsentRecord {
  id: string;
  clientId: string;
  grantorRefJson: { type: string; id: string; label?: string };
  granteeRefJson: { type: 'user' | 'advisor' | 'vendor'; id: string; label: string };
  purposeKey: 'audit' | 'tax' | 'legal' | 'advisor_access' | 'banking' | 'other';
  scopeJson: {
    modulesJson?: string[];
    entityIdsJson?: string[];
    portfolioIdsJson?: string[];
    accountIdsJson?: string[];
    docIdsJson?: string[];
    packIdsJson?: string[];
  };
  restrictionsJson: {
    viewOnly: boolean;
    allowDownload: boolean;
    maskRulesJson?: Record<string, string>;
    clientSafe: boolean;
  };
  effectiveFrom: string;
  effectiveTo?: string;
  statusKey: 'active' | 'revoked' | 'expired';
  evidenceDocIdsJson?: string[];
  createdByUserId: string;
  revokedByUserId?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentRequest {
  id: string;
  clientId: string;
  requesterRefJson: { type: string; id: string; label: string };
  requestTypeKey: 'export' | 'correct' | 'delete' | 'new_access';
  scopeJson: {
    modulesJson?: string[];
    entityIdsJson?: string[];
    docIdsJson?: string[];
    description?: string;
  };
  statusKey: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  dueAt?: string;
  decisionNotes?: string;
  linkedConsentId?: string;
  createdAt: string;
  updatedAt: string;
  fulfilledAt?: string;
}

export interface PrivacyPolicy {
  id: string;
  clientId: string;
  name: string;
  policyTypeKey: 'retention' | 'legal_hold' | 'export_controls' | 'client_safe';
  appliesToJson: {
    modulesJson?: string[];
    objectTypesJson?: string[];
  };
  configJson: Record<string, unknown>;
  statusKey: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AccessReview {
  id: string;
  clientId: string;
  name: string;
  scopeHouseholdId?: string;
  statusKey: 'open' | 'closed';
  dueAt: string;
  startedAt: string;
  closedAt?: string;
  snapshotJson: {
    grantees: Array<{
      granteeId: string;
      granteeLabel: string;
      granteeType: string;
      permissions: string[];
      consentIds: string[];
    }>;
  };
  decisionsJson?: Array<{
    granteeId: string;
    action: 'confirm' | 'revoke' | 'restrict';
    notes?: string;
  }>;
  createdAt: string;
}

export interface ConsentConflict {
  id: string;
  clientId: string;
  conflictTypeKey: 'overlap' | 'expired_access' | 'policy_violation' | 'client_safe_mismatch';
  severityKey: 'ok' | 'warning' | 'critical';
  impactedJson: {
    consentIdsJson?: string[];
    shareIdsJson?: string[];
    docIdsJson?: string[];
    packIdsJson?: string[];
  };
  statusKey: 'open' | 'resolved';
  suggestedResolutionJson?: {
    action: string;
    description: string;
  };
  resolvedByUserId?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface DerivedPermission {
  granteeId: string;
  granteeLabel: string;
  modules: string[];
  entityIds: string[];
  docIds: string[];
  packIds: string[];
  viewOnly: boolean;
  allowDownload: boolean;
  clientSafe: boolean;
  consentIds: string[];
}

export interface ConsentKpis {
  activeConsents: number;
  expiring30d: number;
  requestsPending: number;
  policiesActive: number;
  reviewsDue: number;
  conflictsOpen: number;
  clientSafeOverrides: number;
  revocations30d: number;
}

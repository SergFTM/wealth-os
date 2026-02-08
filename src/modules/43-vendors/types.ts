/**
 * Type definitions for Vendors module collections
 */

export interface Vendor {
  id: string;
  name: string;
  vendorType: string;
  status: 'active' | 'paused' | 'onboarding' | 'terminated';
  primaryContactJson?: {
    name?: string;
    email?: string;
    phone?: string;
    title?: string;
  };
  servicesJson?: string[];
  regionsJson?: string[];
  riskRatingKey?: 'low' | 'medium' | 'high';
  onboardingJson?: {
    kycStatus?: string;
    kybStatus?: string;
    securityQuestionnaireStatus?: string;
    accessSetupStatus?: string;
    accessGrantsJson?: AccessGrant[];
  };
  website?: string;
  addressJson?: {
    city?: string;
    country?: string;
  };
  notes?: string;
  contractsCount?: number;
  spendYtd?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  vendorId: string;
  vendorName?: string;
  name: string;
  status: 'draft' | 'active' | 'expiring' | 'expired' | 'terminated';
  startDate?: string;
  endDate?: string;
  value?: number;
  currency?: string;
  feeModel?: string;
  autoRenew?: boolean;
  termsJson?: Record<string, unknown>;
  notesJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Sla {
  id: string;
  vendorId: string;
  vendorName?: string;
  serviceKey: string;
  status: 'ok' | 'warning' | 'breached';
  kpisJson?: Array<{
    name: string;
    target: number;
    unit: string;
    direction: 'higher' | 'lower';
    weight: number;
  }>;
  metricsJson?: {
    responseTimeAvg?: number;
    uptime?: number;
    accuracy?: number;
    resolutionTimeAvg?: number;
    breachCount?: number;
    warningCount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Scorecard {
  id: string;
  vendorId: string;
  vendorName?: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  criteriaScoresJson?: Array<{
    category: string;
    score: number;
    weight: number;
    notes?: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  vendorId: string;
  vendorName?: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  reportedAt: string;
  resolvedAt?: string;
  linkedCaseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  vendorId: string;
  vendorName?: string;
  linkedContractId?: string;
  contractName?: string;
  invoiceRef: string;
  invoiceDate: string;
  dueDate?: string;
  amount: number;
  currency?: string;
  categoryKey?: string;
  status?: 'pending' | 'approved' | 'paid' | 'disputed' | 'cancelled';
  anomalyScore?: number;
  anomalyFlag?: boolean;
  lineItemsJson?: Array<{
    description: string;
    amount: number;
    quantity?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AccessGrant {
  id: string;
  vendorId: string;
  vendorName?: string;
  grantedTo: string;
  grantedToEmail?: string;
  scope: string;
  status: 'active' | 'expired' | 'revoked';
  grantedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  consentId?: string;
}

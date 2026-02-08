import { BaseRecord } from '@/db/storage/storage.types';

// Data KPI types
export interface DataKpi extends BaseRecord {
  clientId: string;
  name: string;
  domainKey: 'netWorth' | 'performance' | 'liquidity' | 'gl' | 'tax' | 'risk' | 'compliance';
  description: string;
  formulaText: string;
  assumptionsText?: string;
  lastValueJson?: {
    value: number;
    currency?: string;
    unit?: string;
    computedAt: string;
  };
  currency?: string;
  asOf: string;
  trustBadgeKey: 'verified' | 'estimated' | 'stale';
  lineageId?: string;
  lastQualityScoreId?: string;
  status: 'active' | 'draft' | 'archived';
}

// Data Lineage types
export interface LineageInput {
  collection: string;
  fields: string[];
  sourceNotes?: string;
}

export interface LineageTransform {
  stepNo: number;
  title: string;
  description: string;
  formula?: string;
  riskKey?: 'low' | 'medium' | 'high';
}

export interface LineageOutput {
  field: string;
  type: string;
  description?: string;
}

export interface DataLineage extends BaseRecord {
  clientId: string;
  kpiId: string;
  kpiName?: string;
  inputsJson: LineageInput[];
  transformsJson: LineageTransform[];
  outputsJson: LineageOutput[];
}

// Data Quality Score types
export interface QualityDetails {
  missingFields?: string[];
  staleRecords?: number;
  conflictingSources?: string[];
  coverageGaps?: string[];
}

export interface DataQualityScore extends BaseRecord {
  clientId: string;
  scopeKey: 'kpi' | 'collection' | 'entity' | 'portfolio';
  scopeId?: string;
  domainKey: string;
  objectTypeKey: string;
  scoreTotal: number;
  completenessScore: number;
  freshnessScore: number;
  consistencyScore: number;
  coverageScore: number;
  asOf: string;
  computedAt: string;
  detailsJson?: QualityDetails;
}

// Data Reconciliation types
export interface ReconSource {
  name: string;
  system: string;
  value: number;
  currency?: string;
  asOf: string;
  recordCount?: number;
}

export interface ReconBreakdown {
  category: string;
  leftValue: number;
  rightValue: number;
  delta: number;
  status: 'ok' | 'break';
}

export interface DataReconciliation extends BaseRecord {
  clientId: string;
  name?: string;
  reconTypeKey: 'ibor_abor' | 'cash_bank' | 'positions_custodian' | 'gl_subledger';
  scopeJson: {
    entityId?: string;
    portfolioId?: string;
    accountId?: string;
    currency?: string;
  };
  asOf: string;
  leftSourceJson: ReconSource;
  rightSourceJson: ReconSource;
  deltaValueJson: {
    amount: number;
    percent: number;
    currency?: string;
  };
  statusKey: 'ok' | 'break' | 'pending';
  breakdownJson?: ReconBreakdown[];
  computedAt: string;
  linkedExceptionId?: string;
}

// Data Override types
export interface OverrideValue {
  field?: string;
  oldValue?: number | string;
  newValue: number | string;
  adjustmentAmount?: number;
  currency?: string;
}

export interface DataOverride extends BaseRecord {
  clientId: string;
  targetTypeKey: 'kpi' | 'object' | 'recon';
  targetId: string;
  targetName?: string;
  overrideTypeKey: 'adjustment' | 'reclass' | 'mapping_fix';
  valueJson: OverrideValue;
  reason: string;
  statusKey: 'draft' | 'pending' | 'approved' | 'rejected' | 'applied';
  requestedByUserId: string;
  requestedByName?: string;
  approvedByUserId?: string;
  approvedByName?: string;
  appliedAt?: string;
  rejectionReason?: string;
}

// Data Governance Rule types
export interface RuleConfig {
  threshold?: number;
  days?: number;
  deltaPercent?: number;
  severity?: 'info' | 'warning' | 'critical';
  autoEmitException?: boolean;
  exceptionCategory?: string;
}

export interface RuleAppliesTo {
  domains?: string[];
  collections?: string[];
  kpiIds?: string[];
  allKpis?: boolean;
}

export interface DataGovernanceRule extends BaseRecord {
  clientId: string;
  name: string;
  description?: string;
  ruleTypeKey: 'quality_threshold' | 'stale_threshold' | 'recon_threshold' | 'emit_exception';
  appliesToJson: RuleAppliesTo;
  configJson: RuleConfig;
  enabled: boolean;
}

// Why This Number explanation
export interface WhyThisNumber {
  kpiId: string;
  kpiName: string;
  definition: string;
  formula: string;
  currentValue: {
    value: number;
    currency?: string;
    unit?: string;
  };
  asOf: string;
  inputs: Array<{
    name: string;
    collection: string;
    fields: string[];
    currentValue?: number;
    sourceLink?: string;
  }>;
  transforms: Array<{
    step: number;
    title: string;
    description: string;
    formula?: string;
    risk?: 'low' | 'medium' | 'high';
  }>;
  assumptions: string[];
  confidence: 'high' | 'medium' | 'low';
  qualityScore?: number;
  trustBadge: 'verified' | 'estimated' | 'stale';
  lastUpdated: string;
  sources: Array<{
    name: string;
    type: string;
    lastSync?: string;
  }>;
}

// AI Assistant response types
export interface AiExplanation {
  text: string;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
  assumptions: string[];
  disclaimer: string;
}

export interface AiReconCause {
  cause: string;
  likelihood: 'high' | 'medium' | 'low';
  suggestedAction?: string;
}

export interface AiQualityRisk {
  risk: string;
  severity: 'high' | 'medium' | 'low';
  affectedKpis?: string[];
  mitigation?: string;
}

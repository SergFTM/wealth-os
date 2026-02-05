/**
 * Data Quality Exception Schema
 * Individual data quality issues found by rules
 */

import { DqDomain, DqSeverity } from '../config';

export type DqExceptionStatus = 'open' | 'in_progress' | 'resolved' | 'ignored';

export interface EvidenceRef {
  collection: string;
  recordId: string;
  field?: string;
  value?: string | number;
  expectedValue?: string | number;
}

export interface RemediationInfo {
  suggestedAction: string;
  linkedTaskId?: string;
  assignedUserId?: string;
  notes?: string;
}

export interface DqException {
  id: string;
  clientId?: string;
  domain: DqDomain;
  ruleId: string;
  ruleName?: string;
  title: string;
  description?: string;
  severity: DqSeverity;
  scopeType?: 'global' | 'household' | 'entity' | 'account';
  scopeId?: string;
  status: DqExceptionStatus;
  slaDueAt: string;
  ownerUserId?: string;
  evidenceRefs: EvidenceRef[];
  remediation?: RemediationInfo;
  linkedTaskIds?: string[];
  resolvedAt?: string;
  resolutionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DqExceptionCreateInput {
  clientId?: string;
  domain: DqDomain;
  ruleId: string;
  ruleName?: string;
  title: string;
  description?: string;
  severity: DqSeverity;
  scopeType?: DqException['scopeType'];
  scopeId?: string;
  evidenceRefs?: EvidenceRef[];
}

export const DQ_EXCEPTION_STATUS_CONFIG: Record<DqExceptionStatus, { label: { ru: string; en: string; uk: string }; color: string }> = {
  open: { label: { ru: 'Открыто', en: 'Open', uk: 'Відкрито' }, color: 'red' },
  in_progress: { label: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' }, color: 'amber' },
  resolved: { label: { ru: 'Решено', en: 'Resolved', uk: 'Вирішено' }, color: 'emerald' },
  ignored: { label: { ru: 'Игнорируется', en: 'Ignored', uk: 'Ігнорується' }, color: 'gray' },
};

export function isSlaPastDue(slaDueAt: string): boolean {
  return new Date(slaDueAt) < new Date();
}

export function getSlaBadgeColor(slaDueAt: string, status: DqExceptionStatus): string {
  if (status === 'resolved' || status === 'ignored') return 'gray';
  const now = new Date();
  const due = new Date(slaDueAt);
  const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursLeft < 0) return 'red';
  if (hoursLeft < 24) return 'amber';
  return 'emerald';
}

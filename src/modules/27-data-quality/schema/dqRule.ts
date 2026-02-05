/**
 * Data Quality Rule Schema
 */

import { DqDomain, DqRuleType, DqSeverity } from '../config';

export type DqRuleStatus = 'active' | 'paused' | 'draft';

export interface DqRuleThreshold {
  type: 'count' | 'percentage' | 'days' | 'amount';
  value: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
}

export interface DqRule {
  id: string;
  clientId?: string;
  name: string;
  description?: string;
  domain: DqDomain;
  ruleType: DqRuleType;
  targetCollection: string;
  targetFields: string[];
  threshold?: DqRuleThreshold;
  windowDays?: number;
  severityDefault: DqSeverity;
  status: DqRuleStatus;
  autoCreateTask: boolean;
  ownerRole?: string;
  lastRunAt?: string;
  exceptionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DqRuleCreateInput {
  clientId?: string;
  name: string;
  description?: string;
  domain: DqDomain;
  ruleType: DqRuleType;
  targetCollection: string;
  targetFields?: string[];
  threshold?: DqRuleThreshold;
  windowDays?: number;
  severityDefault?: DqSeverity;
  autoCreateTask?: boolean;
  ownerRole?: string;
}

export const DQ_RULE_STATUS_CONFIG: Record<DqRuleStatus, { label: { ru: string; en: string; uk: string }; color: string }> = {
  active: { label: { ru: 'Активно', en: 'Active', uk: 'Активно' }, color: 'emerald' },
  paused: { label: { ru: 'Пауза', en: 'Paused', uk: 'Пауза' }, color: 'gray' },
  draft: { label: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' }, color: 'blue' },
};

export function getRuleIcon(ruleType: DqRuleType): string {
  const icons: Record<DqRuleType, string> = {
    missing_field: '❓',
    invalid_currency: '💱',
    duplicate: '👥',
    mismatch_sum: '🔢',
    stale_as_of: '⏰',
    invalid_reference: '🔗',
    range_violation: '📊',
    format_error: '📝',
  };
  return icons[ruleType] || '📋';
}

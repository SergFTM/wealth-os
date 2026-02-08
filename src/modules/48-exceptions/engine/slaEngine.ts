/**
 * SLA Engine - Manages SLA policies and due date calculations
 */

import { Exception } from './exceptionRouter';

export interface SlaPolicy {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  appliesToTypeKey: string;
  appliesToSeverity?: string;
  defaultSlaHours: number;
  warningThresholdHours?: number;
  escalationHours?: number;
  notifyRolesJson?: string[];
  escalateToRolesJson?: string[];
  enabled: boolean;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export function findApplicablePolicy(
  exception: Exception,
  policies: SlaPolicy[]
): SlaPolicy | null {
  const activePolicies = policies
    .filter(p => p.enabled)
    .sort((a, b) => (a.priority || 50) - (b.priority || 50));

  for (const policy of activePolicies) {
    if (matchesPolicy(exception, policy)) {
      return policy;
    }
  }

  return null;
}

function matchesPolicy(exception: Exception, policy: SlaPolicy): boolean {
  // Check type match
  if (policy.appliesToTypeKey !== 'all' && policy.appliesToTypeKey !== exception.typeKey) {
    return false;
  }

  // Check severity match
  if (policy.appliesToSeverity && policy.appliesToSeverity !== 'all') {
    if (policy.appliesToSeverity !== exception.severity) {
      return false;
    }
  }

  return true;
}

export function calculateSlaDueAt(
  exception: Exception,
  policy: SlaPolicy
): string {
  const createdAt = new Date(exception.createdAt);
  const dueAt = new Date(createdAt.getTime() + policy.defaultSlaHours * 60 * 60 * 1000);
  return dueAt.toISOString();
}

export function applySlaPolicy(
  exception: Exception,
  policy: SlaPolicy
): Partial<Exception> {
  const slaDueAt = calculateSlaDueAt(exception, policy);
  const slaAtRisk = checkSlaAtRisk(slaDueAt, policy.warningThresholdHours);

  return {
    slaPolicyId: policy.id,
    slaDueAt,
    slaAtRisk,
    updatedAt: new Date().toISOString()
  };
}

export function checkSlaAtRisk(
  slaDueAt: string,
  warningThresholdHours?: number
): boolean {
  const now = new Date();
  const due = new Date(slaDueAt);
  const threshold = warningThresholdHours || 4;

  const hoursRemaining = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursRemaining <= threshold && hoursRemaining > 0;
}

export function isSlaPastDue(slaDueAt: string): boolean {
  const now = new Date();
  const due = new Date(slaDueAt);
  return now > due;
}

export function getSlaStatus(exception: Exception): 'ok' | 'at_risk' | 'overdue' | 'no_sla' {
  if (!exception.slaDueAt) {
    return 'no_sla';
  }

  if (isSlaPastDue(exception.slaDueAt)) {
    return 'overdue';
  }

  if (exception.slaAtRisk) {
    return 'at_risk';
  }

  return 'ok';
}

export function updateSlaStatus(exception: Exception, policy?: SlaPolicy): Partial<Exception> {
  if (!exception.slaDueAt) {
    return {};
  }

  const now = new Date();
  const due = new Date(exception.slaDueAt);
  const threshold = policy?.warningThresholdHours || 4;

  const hoursRemaining = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  const slaAtRisk = hoursRemaining <= threshold && hoursRemaining > 0;

  if (exception.slaAtRisk !== slaAtRisk) {
    return {
      slaAtRisk,
      updatedAt: new Date().toISOString()
    };
  }

  return {};
}

export function getTimeToSla(slaDueAt: string): {
  hours: number;
  minutes: number;
  isOverdue: boolean;
  formatted: string;
} {
  const now = new Date();
  const due = new Date(slaDueAt);
  const diffMs = due.getTime() - now.getTime();
  const isOverdue = diffMs < 0;

  const absDiffMs = Math.abs(diffMs);
  const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  let formatted: string;
  if (isOverdue) {
    formatted = `Просрочено на ${hours}ч ${minutes}м`;
  } else if (hours > 24) {
    const days = Math.floor(hours / 24);
    formatted = `${days}д ${hours % 24}ч`;
  } else {
    formatted = `${hours}ч ${minutes}м`;
  }

  return { hours, minutes, isOverdue, formatted };
}

export function shouldEscalate(
  exception: Exception,
  policy?: SlaPolicy
): boolean {
  if (!policy?.escalationHours || !exception.slaDueAt) {
    return false;
  }

  const now = new Date();
  const due = new Date(exception.slaDueAt);
  const escalationTime = new Date(due.getTime() - policy.escalationHours * 60 * 60 * 1000);

  return now >= escalationTime && exception.status !== 'closed';
}

export const slaStatusLabels = {
  ok: { ru: 'В срок', en: 'On Track', uk: 'В строк' },
  at_risk: { ru: 'Под риском', en: 'At Risk', uk: 'Під ризиком' },
  overdue: { ru: 'Просрочено', en: 'Overdue', uk: 'Прострочено' },
  no_sla: { ru: 'Без SLA', en: 'No SLA', uk: 'Без SLA' }
};

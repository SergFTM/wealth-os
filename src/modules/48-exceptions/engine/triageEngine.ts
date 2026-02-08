/**
 * Triage Engine - Handles exception assignment, severity, and SLA management
 */

import { Exception } from './exceptionRouter';

export interface TriageAction {
  type: 'assign' | 'change_severity' | 'change_status' | 'add_watcher' | 'remove_watcher' | 'set_sla';
  payload: Record<string, unknown>;
  performedBy: string;
  performedAt: string;
}

export function assignException(
  exception: Exception,
  assignTo: { userId?: string; role?: string },
  performedBy: string
): Partial<Exception> {
  const now = new Date().toISOString();

  const timelineEntry = {
    at: now,
    type: 'assigned' as const,
    by: performedBy,
    notes: `Назначено: ${assignTo.role || assignTo.userId}`
  };

  return {
    assignedToUserId: assignTo.userId,
    assignedToRole: assignTo.role,
    status: exception.status === 'open' ? 'triage' : exception.status,
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export function changeSeverity(
  exception: Exception,
  newSeverity: 'ok' | 'warning' | 'critical',
  performedBy: string,
  reason?: string
): Partial<Exception> {
  const now = new Date().toISOString();

  const timelineEntry = {
    at: now,
    type: 'severity_changed' as const,
    by: performedBy,
    notes: `Приоритет изменён: ${exception.severity} → ${newSeverity}${reason ? `. Причина: ${reason}` : ''}`
  };

  return {
    severity: newSeverity,
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export function changeStatus(
  exception: Exception,
  newStatus: 'open' | 'triage' | 'in_progress' | 'closed',
  performedBy: string,
  notes?: string
): Partial<Exception> {
  const now = new Date().toISOString();

  const eventType: 'closed' | 'reopened' | 'status_changed' = newStatus === 'closed' ? 'closed' :
                   exception.status === 'closed' ? 'reopened' :
                   'status_changed';

  const timelineEntry = {
    at: now,
    type: eventType,
    by: performedBy,
    notes: notes || `Статус изменён: ${exception.status} → ${newStatus}`
  };

  return {
    status: newStatus,
    closedAt: newStatus === 'closed' ? now : undefined,
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export function addWatcher(
  exception: Exception,
  watcherId: string,
  performedBy: string
): Partial<Exception> {
  const now = new Date().toISOString();
  const currentWatchers = exception.watchersJson || [];

  if (currentWatchers.includes(watcherId)) {
    return {};
  }

  return {
    watchersJson: [...currentWatchers, watcherId],
    updatedAt: now
  };
}

export function removeWatcher(
  exception: Exception,
  watcherId: string
): Partial<Exception> {
  const now = new Date().toISOString();
  const currentWatchers = exception.watchersJson || [];

  return {
    watchersJson: currentWatchers.filter(id => id !== watcherId),
    updatedAt: now
  };
}

export function escalateException(
  exception: Exception,
  escalateTo: { role: string },
  performedBy: string,
  reason: string
): Partial<Exception> {
  const now = new Date().toISOString();

  const timelineEntry = {
    at: now,
    type: 'escalated' as const,
    by: performedBy,
    notes: `Эскалировано на ${escalateTo.role}. Причина: ${reason}`
  };

  return {
    severity: 'critical',
    assignedToRole: escalateTo.role,
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export function addRemediationStep(
  exception: Exception,
  step: {
    title: string;
    ownerRole?: string;
    dueAt?: string;
  },
  performedBy: string
): Partial<Exception> {
  const now = new Date().toISOString();
  const currentSteps = exception.remediationJson || [];

  const newStep = {
    title: step.title,
    status: 'pending' as const,
    ownerRole: step.ownerRole,
    dueAt: step.dueAt
  };

  const timelineEntry = {
    at: now,
    type: 'remediation_updated' as const,
    by: performedBy,
    notes: `Добавлен шаг: ${step.title}`
  };

  return {
    remediationJson: [...currentSteps, newStep],
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export function updateRemediationStep(
  exception: Exception,
  stepIndex: number,
  update: { status?: string; notes?: string },
  performedBy: string
): Partial<Exception> {
  const now = new Date().toISOString();
  const currentSteps = [...(exception.remediationJson || [])];

  if (stepIndex < 0 || stepIndex >= currentSteps.length) {
    return {};
  }

  const step = currentSteps[stepIndex];
  currentSteps[stepIndex] = {
    ...step,
    ...update,
    completedAt: update.status === 'completed' ? now : step.completedAt
  };

  const timelineEntry = {
    at: now,
    type: 'remediation_updated' as const,
    by: performedBy,
    notes: `Обновлён шаг "${step.title}": ${update.status || ''}`
  };

  return {
    remediationJson: currentSteps,
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export function addComment(
  exception: Exception,
  comment: string,
  performedBy: string
): Partial<Exception> {
  const now = new Date().toISOString();

  const timelineEntry = {
    at: now,
    type: 'comment' as const,
    by: performedBy,
    notes: comment
  };

  return {
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export const roleLabels: Record<string, { ru: string; en: string }> = {
  'operations_analyst': { ru: 'Операционный аналитик', en: 'Operations Analyst' },
  'compliance_officer': { ru: 'Комплаенс-офицер', en: 'Compliance Officer' },
  'cio': { ru: 'CIO', en: 'CIO' },
  'cfo': { ru: 'CFO', en: 'CFO' },
  'head_of_ops': { ru: 'Руководитель операций', en: 'Head of Operations' },
  'data_steward': { ru: 'Data Steward', en: 'Data Steward' },
  'risk_manager': { ru: 'Риск-менеджер', en: 'Risk Manager' }
};

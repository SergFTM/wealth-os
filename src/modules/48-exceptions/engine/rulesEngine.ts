/**
 * Rules Engine - Evaluates and applies automation rules to exceptions
 */

import { Exception } from './exceptionRouter';

export interface ExceptionRule {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  ruleTypeKey: 'assign' | 'escalate' | 'close';
  enabled: boolean;
  priority?: number;
  conditionsJson: RuleConditions;
  actionsJson: RuleActions;
  matchCount?: number;
  lastRunAt?: string;
  lastMatchCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RuleConditions {
  sourceModuleKey?: string;
  typeKey?: string;
  severityIn?: string[];
  titleIncludes?: string;
  statusIn?: string[];
  hoursOpen?: number;
  slaAtRisk?: boolean;
  sourceResolved?: boolean;
}

export interface RuleActions {
  assignToRole?: string;
  assignToUserId?: string;
  setSeverity?: 'ok' | 'warning' | 'critical';
  setStatus?: 'open' | 'triage' | 'in_progress' | 'closed';
  setSlaHours?: number;
  addWatchers?: string[];
  closeWhen?: {
    sourceState?: string;
  };
  notifyRoles?: string[];
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  actions?: RuleActions;
  reason?: string;
}

export function evaluateRule(
  exception: Exception,
  rule: ExceptionRule
): RuleEvaluationResult {
  if (!rule.enabled) {
    return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Rule disabled' };
  }

  const conditions = rule.conditionsJson;

  // Check sourceModuleKey
  if (conditions.sourceModuleKey && exception.sourceModuleKey !== conditions.sourceModuleKey) {
    return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Source module mismatch' };
  }

  // Check typeKey
  if (conditions.typeKey && exception.typeKey !== conditions.typeKey) {
    return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Type mismatch' };
  }

  // Check severityIn
  if (conditions.severityIn && conditions.severityIn.length > 0) {
    if (!conditions.severityIn.includes(exception.severity)) {
      return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Severity not in list' };
    }
  }

  // Check statusIn
  if (conditions.statusIn && conditions.statusIn.length > 0) {
    if (!conditions.statusIn.includes(exception.status)) {
      return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Status not in list' };
    }
  }

  // Check titleIncludes
  if (conditions.titleIncludes) {
    const searchTerms = conditions.titleIncludes.toLowerCase().split(/\s+/);
    const title = exception.title.toLowerCase();
    const allTermsMatch = searchTerms.every(term => title.includes(term));
    if (!allTermsMatch) {
      return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Title does not include required terms' };
    }
  }

  // Check hoursOpen
  if (conditions.hoursOpen !== undefined) {
    const createdAt = new Date(exception.createdAt);
    const now = new Date();
    const hoursOpen = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursOpen < conditions.hoursOpen) {
      return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Not open long enough' };
    }
  }

  // Check slaAtRisk
  if (conditions.slaAtRisk !== undefined && exception.slaAtRisk !== conditions.slaAtRisk) {
    return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'SLA at risk mismatch' };
  }

  // Check sourceResolved
  if (conditions.sourceResolved !== undefined && exception.sourceResolved !== conditions.sourceResolved) {
    return { ruleId: rule.id, ruleName: rule.name, matched: false, reason: 'Source resolved mismatch' };
  }

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    matched: true,
    actions: rule.actionsJson
  };
}

export function evaluateAllRules(
  exception: Exception,
  rules: ExceptionRule[]
): RuleEvaluationResult[] {
  const sortedRules = [...rules].sort((a, b) => (a.priority || 50) - (b.priority || 50));
  return sortedRules.map(rule => evaluateRule(exception, rule));
}

export function applyRuleActions(
  exception: Exception,
  actions: RuleActions,
  performedBy: string
): Partial<Exception> {
  const now = new Date().toISOString();
  const updates: Partial<Exception> = {
    updatedAt: now
  };

  type TimelineEventType = 'created' | 'assigned' | 'severity_changed' | 'status_changed' | 'closed' | 'reopened' | 'escalated' | 'remediation_updated' | 'comment';
  const timelineEntries: Array<{ at: string; type: TimelineEventType; by: string; notes: string }> = [];

  if (actions.assignToRole) {
    updates.assignedToRole = actions.assignToRole;
    timelineEntries.push({
      at: now,
      type: 'assigned',
      by: performedBy,
      notes: `Авто-назначено правилом: ${actions.assignToRole}`
    });
  }

  if (actions.assignToUserId) {
    updates.assignedToUserId = actions.assignToUserId;
  }

  if (actions.setSeverity) {
    updates.severity = actions.setSeverity;
    timelineEntries.push({
      at: now,
      type: 'severity_changed',
      by: performedBy,
      notes: `Приоритет изменён правилом: ${actions.setSeverity}`
    });
  }

  if (actions.setStatus) {
    updates.status = actions.setStatus;
    if (actions.setStatus === 'closed') {
      updates.closedAt = now;
    }
    timelineEntries.push({
      at: now,
      type: actions.setStatus === 'closed' ? 'closed' : 'status_changed',
      by: performedBy,
      notes: `Статус изменён правилом: ${actions.setStatus}`
    });
  }

  if (actions.addWatchers && actions.addWatchers.length > 0) {
    const currentWatchers = exception.watchersJson || [];
    updates.watchersJson = [...new Set([...currentWatchers, ...actions.addWatchers])];
  }

  if (timelineEntries.length > 0) {
    updates.timelineJson = [...(exception.timelineJson || []), ...timelineEntries];
  }

  return updates;
}

export function runRulesOnExceptions(
  exceptions: Exception[],
  rules: ExceptionRule[],
  performedBy: string = 'system'
): Array<{
  exceptionId: string;
  matchedRules: RuleEvaluationResult[];
  updates: Partial<Exception>;
}> {
  const results: Array<{
    exceptionId: string;
    matchedRules: RuleEvaluationResult[];
    updates: Partial<Exception>;
  }> = [];

  for (const exception of exceptions) {
    if (exception.status === 'closed') continue;

    const evaluations = evaluateAllRules(exception, rules);
    const matchedRules = evaluations.filter(e => e.matched);

    if (matchedRules.length > 0) {
      // Apply first matching rule (highest priority)
      const firstMatch = matchedRules[0];
      if (firstMatch.actions) {
        const updates = applyRuleActions(exception, firstMatch.actions, performedBy);
        results.push({
          exceptionId: exception.id,
          matchedRules,
          updates
        });
      }
    }
  }

  return results;
}

export function buildRuleFromTemplate(
  clientId: string,
  template: 'assign_by_type' | 'escalate_sla' | 'auto_close_resolved'
): Omit<ExceptionRule, 'id' | 'createdAt' | 'updatedAt'> {
  switch (template) {
    case 'assign_by_type':
      return {
        clientId,
        name: 'Авто-назначение по типу sync',
        description: 'Назначает исключения синхронизации на Operations Analyst',
        ruleTypeKey: 'assign',
        enabled: true,
        priority: 10,
        conditionsJson: {
          typeKey: 'sync',
          statusIn: ['open']
        },
        actionsJson: {
          assignToRole: 'operations_analyst'
        }
      };

    case 'escalate_sla':
      return {
        clientId,
        name: 'Эскалация при риске SLA',
        description: 'Повышает приоритет при приближении дедлайна',
        ruleTypeKey: 'escalate',
        enabled: true,
        priority: 5,
        conditionsJson: {
          slaAtRisk: true,
          statusIn: ['open', 'triage', 'in_progress']
        },
        actionsJson: {
          setSeverity: 'critical',
          notifyRoles: ['head_of_ops']
        }
      };

    case 'auto_close_resolved':
      return {
        clientId,
        name: 'Авто-закрытие при исправлении источника',
        description: 'Закрывает исключение когда источник помечен как исправленный',
        ruleTypeKey: 'close',
        enabled: true,
        priority: 20,
        conditionsJson: {
          sourceResolved: true,
          statusIn: ['open', 'triage', 'in_progress']
        },
        actionsJson: {
          setStatus: 'closed',
          closeWhen: {
            sourceState: 'fixed'
          }
        }
      };
  }
}

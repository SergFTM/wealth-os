import { DataGovernanceRule, DataKpi, DataQualityScore, DataReconciliation, RuleConfig, RuleAppliesTo } from './types';
import { RULE_TYPES, QUALITY_THRESHOLDS } from '../config';

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  triggered: boolean;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  shouldEmitException: boolean;
  affectedItems: string[];
}

export interface RuleContext {
  kpis: DataKpi[];
  qualityScores: DataQualityScore[];
  reconciliations: DataReconciliation[];
  currentDate: Date;
}

/**
 * Evaluate a single rule against context
 */
export function evaluateRule(
  rule: DataGovernanceRule,
  context: RuleContext
): RuleEvaluationResult {
  if (!rule.enabled) {
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      triggered: false,
      severity: 'info',
      message: 'Rule is disabled',
      shouldEmitException: false,
      affectedItems: [],
    };
  }

  switch (rule.ruleTypeKey) {
    case 'quality_threshold':
      return evaluateQualityThreshold(rule, context);
    case 'stale_threshold':
      return evaluateStaleThreshold(rule, context);
    case 'recon_threshold':
      return evaluateReconThreshold(rule, context);
    case 'emit_exception':
      return evaluateEmitException(rule, context);
    default:
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        triggered: false,
        severity: 'info',
        message: 'Unknown rule type',
        shouldEmitException: false,
        affectedItems: [],
      };
  }
}

/**
 * Evaluate quality threshold rule
 */
function evaluateQualityThreshold(
  rule: DataGovernanceRule,
  context: RuleContext
): RuleEvaluationResult {
  const threshold = rule.configJson.threshold || QUALITY_THRESHOLDS.low;
  const severity = rule.configJson.severity || 'warning';

  // Filter scores by appliesTo
  const applicableScores = filterByAppliesTo(
    context.qualityScores,
    rule.appliesToJson,
    (score) => score.domainKey
  );

  const belowThreshold = applicableScores.filter(s => s.scoreTotal < threshold);

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    triggered: belowThreshold.length > 0,
    severity,
    message: belowThreshold.length > 0
      ? `${belowThreshold.length} quality score(s) below threshold of ${threshold}%`
      : 'All quality scores above threshold',
    shouldEmitException: Boolean(rule.configJson.autoEmitException) && belowThreshold.length > 0,
    affectedItems: belowThreshold.map(s => s.id),
  };
}

/**
 * Evaluate stale threshold rule
 */
function evaluateStaleThreshold(
  rule: DataGovernanceRule,
  context: RuleContext
): RuleEvaluationResult {
  const days = rule.configJson.days || 7;
  const severity = rule.configJson.severity || 'warning';
  const thresholdDate = new Date(context.currentDate);
  thresholdDate.setDate(thresholdDate.getDate() - days);

  // Filter KPIs by appliesTo
  const applicableKpis = filterByAppliesTo(
    context.kpis,
    rule.appliesToJson,
    (kpi) => kpi.domainKey
  );

  const staleKpis = applicableKpis.filter(kpi => {
    const asOf = new Date(kpi.asOf);
    return asOf < thresholdDate;
  });

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    triggered: staleKpis.length > 0,
    severity,
    message: staleKpis.length > 0
      ? `${staleKpis.length} KPI(s) not updated in ${days} days`
      : 'All KPIs are current',
    shouldEmitException: Boolean(rule.configJson.autoEmitException) && staleKpis.length > 0,
    affectedItems: staleKpis.map(k => k.id),
  };
}

/**
 * Evaluate reconciliation threshold rule
 */
function evaluateReconThreshold(
  rule: DataGovernanceRule,
  context: RuleContext
): RuleEvaluationResult {
  const deltaPercent = rule.configJson.deltaPercent || 1;
  const severity = rule.configJson.severity || 'critical';

  const breaksAboveThreshold = context.reconciliations.filter(
    r => r.statusKey === 'break' && r.deltaValueJson.percent > deltaPercent
  );

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    triggered: breaksAboveThreshold.length > 0,
    severity,
    message: breaksAboveThreshold.length > 0
      ? `${breaksAboveThreshold.length} recon break(s) exceed ${deltaPercent}% threshold`
      : 'No significant recon breaks',
    shouldEmitException: Boolean(rule.configJson.autoEmitException) && breaksAboveThreshold.length > 0,
    affectedItems: breaksAboveThreshold.map(r => r.id),
  };
}

/**
 * Evaluate emit exception rule
 */
function evaluateEmitException(
  rule: DataGovernanceRule,
  context: RuleContext
): RuleEvaluationResult {
  // This rule type is used to define when to emit exceptions
  // Check for any condition that should trigger an exception
  const qualityIssues = context.qualityScores.filter(
    s => s.scoreTotal < (rule.configJson.threshold || QUALITY_THRESHOLDS.low)
  );
  const reconBreaks = context.reconciliations.filter(r => r.statusKey === 'break');

  const triggered = qualityIssues.length > 0 || reconBreaks.length > 0;

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    triggered,
    severity: rule.configJson.severity || 'warning',
    message: triggered
      ? `Found ${qualityIssues.length} quality issues and ${reconBreaks.length} recon breaks`
      : 'No issues found',
    shouldEmitException: triggered,
    affectedItems: [...qualityIssues.map(q => q.id), ...reconBreaks.map(r => r.id)],
  };
}

/**
 * Evaluate all enabled rules
 */
export function evaluateAllRules(
  rules: DataGovernanceRule[],
  context: RuleContext
): RuleEvaluationResult[] {
  return rules
    .filter(r => r.enabled)
    .map(rule => evaluateRule(rule, context));
}

/**
 * Get rules that should emit exceptions
 */
export function getRulesRequiringExceptions(
  results: RuleEvaluationResult[]
): RuleEvaluationResult[] {
  return results.filter(r => r.shouldEmitException);
}

/**
 * Create rule record
 */
export function createRule(
  clientId: string,
  name: string,
  ruleTypeKey: keyof typeof RULE_TYPES,
  appliesToJson: RuleAppliesTo,
  configJson: RuleConfig,
  description?: string
): Omit<DataGovernanceRule, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId,
    name,
    description,
    ruleTypeKey,
    appliesToJson,
    configJson,
    enabled: true,
  };
}

/**
 * Toggle rule enabled status
 */
export function toggleRuleEnabled(rule: DataGovernanceRule): Partial<DataGovernanceRule> {
  return {
    enabled: !rule.enabled,
  };
}

/**
 * Update rule configuration
 */
export function updateRuleConfig(
  rule: DataGovernanceRule,
  configJson: Partial<RuleConfig>
): Partial<DataGovernanceRule> {
  return {
    configJson: { ...rule.configJson, ...configJson },
  };
}

/**
 * Validate rule configuration
 */
export function validateRuleConfig(
  ruleTypeKey: keyof typeof RULE_TYPES,
  configJson: RuleConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (ruleTypeKey) {
    case 'quality_threshold':
      if (configJson.threshold !== undefined && (configJson.threshold < 0 || configJson.threshold > 100)) {
        errors.push('Threshold must be between 0 and 100');
      }
      break;

    case 'stale_threshold':
      if (configJson.days !== undefined && configJson.days < 1) {
        errors.push('Days must be at least 1');
      }
      break;

    case 'recon_threshold':
      if (configJson.deltaPercent !== undefined && configJson.deltaPercent < 0) {
        errors.push('Delta percent must be non-negative');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper function to filter by appliesTo
function filterByAppliesTo<T>(
  items: T[],
  appliesTo: RuleAppliesTo,
  getDomain: (item: T) => string
): T[] {
  if (appliesTo.allKpis) {
    return items;
  }

  if (appliesTo.domains && appliesTo.domains.length > 0) {
    return items.filter(item => appliesTo.domains!.includes(getDomain(item)));
  }

  return items;
}

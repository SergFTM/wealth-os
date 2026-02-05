/**
 * Sharing Evaluator Engine - evaluates if an action is allowed
 */

import { Consent, isConsentActive, hasPermission } from './consentEngine';

export interface SharingPolicy {
  id: string;
  clientId: string;
  name: string;
  appliesTo: 'documents' | 'reports' | 'both';
  status: 'active' | 'paused';
  priority: number;
  rules: PolicyRule[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyRule {
  id: string;
  condition?: string;
  matchScopeType?: string[];
  matchDocTags?: string[];
  matchReportType?: string[];
  matchRole?: string[];
  allowActions?: string[];
  denyActions?: string[];
  enforceWatermark?: boolean;
  enforceClientSafe?: boolean;
}

export interface EvaluationContext {
  subjectType: 'user' | 'advisor' | 'client';
  subjectId: string;
  subjectRole?: string;
  action: 'view' | 'download' | 'export' | 'api';
  targetType: 'document' | 'report';
  targetId: string;
  targetTags?: string[];
  targetReportType?: string;
  scopeType?: string;
  scopeId?: string;
  clientId: string;
}

export interface EvaluationResult {
  allowed: boolean;
  reason: string;
  appliedConsentId?: string;
  appliedPolicyId?: string;
  enforceWatermark: boolean;
  enforceClientSafe: boolean;
}

export function evaluateAccess(
  context: EvaluationContext,
  consents: Consent[],
  policies: SharingPolicy[]
): EvaluationResult {
  // Step 1: Find applicable consent
  const applicableConsent = findApplicableConsent(context, consents);

  if (!applicableConsent) {
    return {
      allowed: false,
      reason: 'No active consent found for this subject and scope',
      enforceWatermark: false,
      enforceClientSafe: false,
    };
  }

  // Step 2: Check if consent grants the requested permission
  if (!hasPermission(applicableConsent, context.action)) {
    return {
      allowed: false,
      reason: `Consent does not grant "${context.action}" permission`,
      appliedConsentId: applicableConsent.id,
      enforceWatermark: false,
      enforceClientSafe: false,
    };
  }

  // Step 3: Apply sharing policies
  const activePolicies = policies
    .filter(p => p.status === 'active' && p.clientId === context.clientId)
    .filter(p => p.appliesTo === 'both' || p.appliesTo === `${context.targetType}s`)
    .sort((a, b) => a.priority - b.priority);

  let enforceWatermark = applicableConsent.watermarkRequired;
  let enforceClientSafe = applicableConsent.clientSafe;

  for (const policy of activePolicies) {
    const ruleResult = evaluatePolicyRules(context, policy);

    if (ruleResult.matched) {
      if (ruleResult.denied) {
        return {
          allowed: false,
          reason: `Denied by policy "${policy.name}": ${ruleResult.denyReason}`,
          appliedConsentId: applicableConsent.id,
          appliedPolicyId: policy.id,
          enforceWatermark,
          enforceClientSafe,
        };
      }

      if (ruleResult.enforceWatermark) {
        enforceWatermark = true;
      }
      if (ruleResult.enforceClientSafe) {
        enforceClientSafe = true;
      }
    }
  }

  return {
    allowed: true,
    reason: 'Access granted by consent and policies',
    appliedConsentId: applicableConsent.id,
    enforceWatermark,
    enforceClientSafe,
  };
}

function findApplicableConsent(
  context: EvaluationContext,
  consents: Consent[]
): Consent | null {
  // Filter consents by subject
  const subjectConsents = consents.filter(c =>
    c.subjectType === context.subjectType &&
    c.subjectId === context.subjectId &&
    c.clientId === context.clientId &&
    isConsentActive(c)
  );

  if (subjectConsents.length === 0) return null;

  // Find consent matching scope (most specific first)
  // Direct document/report consent
  const directConsent = subjectConsents.find(c =>
    c.scopeType === context.targetType &&
    c.scopeId === context.targetId
  );
  if (directConsent) return directConsent;

  // Scope-level consent (account, entity, household)
  if (context.scopeType && context.scopeId) {
    const scopeConsent = subjectConsents.find(c =>
      c.scopeType === context.scopeType &&
      c.scopeId === context.scopeId
    );
    if (scopeConsent) return scopeConsent;
  }

  // Household-level consent (broadest)
  const householdConsent = subjectConsents.find(c =>
    c.scopeType === 'household'
  );
  if (householdConsent) return householdConsent;

  return null;
}

interface RuleEvaluationResult {
  matched: boolean;
  denied: boolean;
  denyReason?: string;
  enforceWatermark?: boolean;
  enforceClientSafe?: boolean;
}

function evaluatePolicyRules(
  context: EvaluationContext,
  policy: SharingPolicy
): RuleEvaluationResult {
  for (const rule of policy.rules) {
    // Check if rule matches context
    const matches = doesRuleMatch(context, rule);
    if (!matches) continue;

    // Check deny actions
    if (rule.denyActions?.includes(context.action)) {
      return {
        matched: true,
        denied: true,
        denyReason: `Action "${context.action}" is denied by rule`,
      };
    }

    // Check allow actions (if specified, action must be in list)
    if (rule.allowActions && rule.allowActions.length > 0) {
      if (!rule.allowActions.includes(context.action)) {
        return {
          matched: true,
          denied: true,
          denyReason: `Action "${context.action}" is not in allowed list`,
        };
      }
    }

    return {
      matched: true,
      denied: false,
      enforceWatermark: rule.enforceWatermark,
      enforceClientSafe: rule.enforceClientSafe,
    };
  }

  return { matched: false, denied: false };
}

function doesRuleMatch(context: EvaluationContext, rule: PolicyRule): boolean {
  // Match by role
  if (rule.matchRole && rule.matchRole.length > 0) {
    const role = context.subjectRole || context.subjectType;
    if (!rule.matchRole.includes(role)) return false;
  }

  // Match by scope type
  if (rule.matchScopeType && rule.matchScopeType.length > 0) {
    if (!context.scopeType || !rule.matchScopeType.includes(context.scopeType)) {
      return false;
    }
  }

  // Match by document tags
  if (rule.matchDocTags && rule.matchDocTags.length > 0) {
    if (!context.targetTags || context.targetTags.length === 0) return false;
    const hasMatchingTag = rule.matchDocTags.some(tag =>
      context.targetTags!.includes(tag)
    );
    if (!hasMatchingTag) return false;
  }

  // Match by report type
  if (rule.matchReportType && rule.matchReportType.length > 0) {
    if (!context.targetReportType) return false;
    if (!rule.matchReportType.includes(context.targetReportType)) return false;
  }

  return true;
}

export function previewPolicyEvaluation(
  subjectType: string,
  subjectRole: string,
  targetType: 'document' | 'report',
  targetTags: string[],
  action: string,
  policies: SharingPolicy[]
): { policyId: string; policyName: string; result: string }[] {
  const results: { policyId: string; policyName: string; result: string }[] = [];

  const mockContext: EvaluationContext = {
    subjectType: subjectType as 'user' | 'advisor' | 'client',
    subjectId: 'preview',
    subjectRole,
    action: action as 'view' | 'download' | 'export' | 'api',
    targetType,
    targetId: 'preview',
    targetTags,
    clientId: 'preview',
  };

  for (const policy of policies.filter(p => p.status === 'active')) {
    const ruleResult = evaluatePolicyRules(mockContext, policy);

    if (ruleResult.matched) {
      if (ruleResult.denied) {
        results.push({
          policyId: policy.id,
          policyName: policy.name,
          result: `DENIED: ${ruleResult.denyReason}`,
        });
      } else {
        let extras = [];
        if (ruleResult.enforceWatermark) extras.push('watermark');
        if (ruleResult.enforceClientSafe) extras.push('client-safe');
        results.push({
          policyId: policy.id,
          policyName: policy.name,
          result: `ALLOWED${extras.length ? ` (${extras.join(', ')})` : ''}`,
        });
      }
    }
  }

  return results;
}

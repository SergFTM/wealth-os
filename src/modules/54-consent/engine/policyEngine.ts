/**
 * Policy Engine — read policies and validate actions
 */

import type { PrivacyPolicy } from './types';

export interface PolicyValidationResult {
  allowed: boolean;
  violations: string[];
  warnings: string[];
}

export function getActivePolicies(policies: PrivacyPolicy[]): PrivacyPolicy[] {
  return policies.filter(p => p.statusKey === 'active');
}

export function getPoliciesByType(
  policies: PrivacyPolicy[],
  policyType: PrivacyPolicy['policyTypeKey']
): PrivacyPolicy[] {
  return getActivePolicies(policies).filter(p => p.policyTypeKey === policyType);
}

export function validateShareAction(
  policies: PrivacyPolicy[],
  shareModules: string[],
  shareTtlDays?: number,
  allowDownload?: boolean
): PolicyValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];

  const exportPolicies = getPoliciesByType(policies, 'export_controls');

  for (const policy of exportPolicies) {
    const config = policy.configJson as {
      maxShareTtlDays?: number;
      requireDownloadLimit?: boolean;
      blockedModules?: string[];
    };

    // Check TTL
    if (config.maxShareTtlDays && shareTtlDays && shareTtlDays > config.maxShareTtlDays) {
      violations.push(
        `Share TTL ${shareTtlDays}d exceeds policy limit ${config.maxShareTtlDays}d (${policy.name})`
      );
    }

    // Check download limit
    if (config.requireDownloadLimit && allowDownload) {
      warnings.push(
        `Download enabled — policy "${policy.name}" recommends download limits for sensitive data`
      );
    }

    // Check blocked modules
    if (config.blockedModules) {
      const blocked = shareModules.filter(m => config.blockedModules!.includes(m));
      if (blocked.length > 0) {
        violations.push(
          `Modules [${blocked.join(', ')}] blocked by policy "${policy.name}"`
        );
      }
    }
  }

  return {
    allowed: violations.length === 0,
    violations,
    warnings,
  };
}

export function validateRetention(
  policies: PrivacyPolicy[],
  moduleSlug: string,
  recordAgeDays: number
): PolicyValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];

  const retentionPolicies = getPoliciesByType(policies, 'retention');

  for (const policy of retentionPolicies) {
    const modules = policy.appliesToJson.modulesJson || [];
    if (modules.length > 0 && !modules.includes(moduleSlug)) continue;

    const config = policy.configJson as {
      maxRetentionDays?: number;
      minRetentionDays?: number;
    };

    if (config.maxRetentionDays && recordAgeDays > config.maxRetentionDays) {
      warnings.push(
        `Record age ${recordAgeDays}d exceeds retention limit ${config.maxRetentionDays}d (${policy.name})`
      );
    }
  }

  return {
    allowed: violations.length === 0,
    violations,
    warnings,
  };
}

export function isUnderLegalHold(policies: PrivacyPolicy[], objectType: string): boolean {
  const holdPolicies = getPoliciesByType(policies, 'legal_hold');
  return holdPolicies.some(p => {
    const types = p.appliesToJson.objectTypesJson || [];
    return types.length === 0 || types.includes(objectType);
  });
}

export function buildPolicyPayload(
  data: Pick<PrivacyPolicy, 'clientId' | 'name' | 'policyTypeKey' | 'appliesToJson' | 'configJson'>
): Omit<PrivacyPolicy, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: data.clientId,
    name: data.name,
    policyTypeKey: data.policyTypeKey,
    appliesToJson: data.appliesToJson,
    configJson: data.configJson,
    statusKey: 'active',
  };
}

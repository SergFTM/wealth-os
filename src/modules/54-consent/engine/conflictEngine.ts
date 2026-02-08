/**
 * Conflict Engine — detect and resolve consent conflicts
 */

import type { ConsentRecord, ConsentConflict, PrivacyPolicy } from './types';
import { isConsentActive } from './consentEngine';

export interface DetectedConflict {
  conflictTypeKey: ConsentConflict['conflictTypeKey'];
  severityKey: ConsentConflict['severityKey'];
  impactedJson: ConsentConflict['impactedJson'];
  suggestedResolutionJson: ConsentConflict['suggestedResolutionJson'];
}

export function detectOverlaps(consents: ConsentRecord[]): DetectedConflict[] {
  const conflicts: DetectedConflict[] = [];
  const active = consents.filter(isConsentActive);

  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];

      // Same grantee, overlapping modules, different restrictions
      if (a.granteeRefJson.id !== b.granteeRefJson.id) continue;

      const aModules = a.scopeJson.modulesJson || [];
      const bModules = b.scopeJson.modulesJson || [];
      const overlap = aModules.filter(m => bModules.includes(m));

      if (overlap.length === 0) continue;

      // Check contradictory restrictions
      if (
        a.restrictionsJson.viewOnly !== b.restrictionsJson.viewOnly ||
        a.restrictionsJson.allowDownload !== b.restrictionsJson.allowDownload ||
        a.restrictionsJson.clientSafe !== b.restrictionsJson.clientSafe
      ) {
        conflicts.push({
          conflictTypeKey: 'overlap',
          severityKey: 'warning',
          impactedJson: { consentIdsJson: [a.id, b.id] },
          suggestedResolutionJson: {
            action: 'harmonize',
            description: `Согласия ${a.id.slice(0, 8)} и ${b.id.slice(0, 8)} имеют пересекающиеся модули [${overlap.join(', ')}] с разными ограничениями. Рекомендуется унифицировать.`,
          },
        });
      }
    }
  }

  return conflicts;
}

export function detectExpiredAccess(consents: ConsentRecord[]): DetectedConflict[] {
  const conflicts: DetectedConflict[] = [];
  const now = new Date();

  for (const c of consents) {
    if (c.statusKey === 'active' && c.effectiveTo) {
      const expiry = new Date(c.effectiveTo);
      if (expiry < now) {
        conflicts.push({
          conflictTypeKey: 'expired_access',
          severityKey: 'critical',
          impactedJson: { consentIdsJson: [c.id] },
          suggestedResolutionJson: {
            action: 'revoke',
            description: `Согласие ${c.id.slice(0, 8)} истекло ${c.effectiveTo}, но не отозвано. Рекомендуется немедленный отзыв.`,
          },
        });
      }
    }
  }

  return conflicts;
}

export function detectPolicyViolations(
  consents: ConsentRecord[],
  policies: PrivacyPolicy[]
): DetectedConflict[] {
  const conflicts: DetectedConflict[] = [];
  const active = consents.filter(isConsentActive);
  const exportPolicies = policies.filter(
    p => p.statusKey === 'active' && p.policyTypeKey === 'export_controls'
  );

  for (const consent of active) {
    for (const policy of exportPolicies) {
      const config = policy.configJson as {
        blockedModules?: string[];
        requireDownloadLimit?: boolean;
      };

      const blocked = (consent.scopeJson.modulesJson || []).filter(
        m => config.blockedModules?.includes(m)
      );

      if (blocked.length > 0) {
        conflicts.push({
          conflictTypeKey: 'policy_violation',
          severityKey: 'critical',
          impactedJson: { consentIdsJson: [consent.id] },
          suggestedResolutionJson: {
            action: 'restrict_scope',
            description: `Согласие ${consent.id.slice(0, 8)} включает заблокированные модули [${blocked.join(', ')}] по политике "${policy.name}".`,
          },
        });
      }
    }
  }

  return conflicts;
}

export function detectClientSafeMismatches(consents: ConsentRecord[]): DetectedConflict[] {
  const conflicts: DetectedConflict[] = [];
  const active = consents.filter(isConsentActive);

  // Find grantees with mixed clientSafe flags
  const granteeMap = new Map<string, ConsentRecord[]>();
  for (const c of active) {
    const key = c.granteeRefJson.id;
    const list = granteeMap.get(key) || [];
    list.push(c);
    granteeMap.set(key, list);
  }

  for (const [, group] of granteeMap) {
    const hasClientSafe = group.some(c => c.restrictionsJson.clientSafe);
    const hasNonClientSafe = group.some(c => !c.restrictionsJson.clientSafe);

    if (hasClientSafe && hasNonClientSafe) {
      conflicts.push({
        conflictTypeKey: 'client_safe_mismatch',
        severityKey: 'warning',
        impactedJson: { consentIdsJson: group.map(c => c.id) },
        suggestedResolutionJson: {
          action: 'enforce_client_safe',
          description: `Получатель "${group[0].granteeRefJson.label}" имеет согласия с разными client-safe настройками. Рекомендуется унифицировать.`,
        },
      });
    }
  }

  return conflicts;
}

export function detectAllConflicts(
  consents: ConsentRecord[],
  policies: PrivacyPolicy[]
): DetectedConflict[] {
  return [
    ...detectOverlaps(consents),
    ...detectExpiredAccess(consents),
    ...detectPolicyViolations(consents, policies),
    ...detectClientSafeMismatches(consents),
  ];
}

export function buildConflictPayload(
  clientId: string,
  detected: DetectedConflict
): Omit<ConsentConflict, 'id' | 'createdAt'> {
  return {
    clientId,
    conflictTypeKey: detected.conflictTypeKey,
    severityKey: detected.severityKey,
    impactedJson: detected.impactedJson,
    statusKey: 'open',
    suggestedResolutionJson: detected.suggestedResolutionJson,
  };
}

export function buildResolvePayload(userId: string) {
  return {
    statusKey: 'resolved' as const,
    resolvedByUserId: userId,
    resolvedAt: new Date().toISOString(),
  };
}

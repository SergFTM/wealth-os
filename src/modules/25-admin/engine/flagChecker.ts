/**
 * Feature Flag Checker Engine
 * Checks feature flag status for conditional rendering
 */

import { FeatureFlag, KNOWN_FLAGS } from '../schema/featureFlag';

export interface FlagContext {
  isStaff: boolean;
  userId?: string;
}

export function checkFlag(
  flags: FeatureFlag[],
  key: string,
  context: FlagContext = { isStaff: true }
): boolean {
  const flag = flags.find(f => f.key === key);
  if (!flag) return false;
  if (!flag.enabled) return false;

  // Check audience
  if (flag.audience === 'staff' && !context.isStaff) return false;
  if (flag.audience === 'client' && context.isStaff) return false;

  // Check rollout percentage
  if (flag.rolloutPct < 100) {
    // Use userId hash for consistent rollout, or random if no userId
    const hash = context.userId
      ? simpleHash(context.userId + key)
      : Math.random() * 100;
    const normalizedHash = context.userId ? hash % 100 : hash;
    return normalizedHash < flag.rolloutPct;
  }

  return true;
}

export function checkFlags(
  flags: FeatureFlag[],
  keys: string[],
  context: FlagContext = { isStaff: true }
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  keys.forEach(key => {
    result[key] = checkFlag(flags, key, context);
  });
  return result;
}

export function getEnabledFlags(
  flags: FeatureFlag[],
  context: FlagContext = { isStaff: true }
): string[] {
  return flags
    .filter(f => checkFlag(flags, f.key, context))
    .map(f => f.key);
}

export function countEnabledFlags(flags: FeatureFlag[]): number {
  return flags.filter(f => f.enabled).length;
}

// Check known flags
export function checkKnownFlags(
  flags: FeatureFlag[],
  context: FlagContext = { isStaff: true }
) {
  return {
    showAiAdvanced: checkFlag(flags, KNOWN_FLAGS.SHOW_AI_ADVANCED, context),
    showApiModule: checkFlag(flags, KNOWN_FLAGS.SHOW_API_MODULE, context),
    showReportingStudio: checkFlag(flags, KNOWN_FLAGS.SHOW_REPORTING_STUDIO, context),
    showRiskAnalytics: checkFlag(flags, KNOWN_FLAGS.SHOW_RISK_ANALYTICS, context),
    showTaxHarvesting: checkFlag(flags, KNOWN_FLAGS.SHOW_TAX_HARVESTING, context),
    enableDarkMode: checkFlag(flags, KNOWN_FLAGS.ENABLE_DARK_MODE, context),
    enableExportPdf: checkFlag(flags, KNOWN_FLAGS.ENABLE_EXPORT_PDF, context),
    enableBulkActions: checkFlag(flags, KNOWN_FLAGS.ENABLE_BULK_ACTIONS, context),
    showBetaFeatures: checkFlag(flags, KNOWN_FLAGS.SHOW_BETA_FEATURES, context),
    enableWebhooks: checkFlag(flags, KNOWN_FLAGS.ENABLE_WEBHOOKS, context),
  };
}

// Simple string hash for consistent rollout
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

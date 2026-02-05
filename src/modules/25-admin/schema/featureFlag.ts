/**
 * Feature Flag Schema
 * Beta features and conditional rendering flags
 */

export type FlagAudience = 'staff' | 'client' | 'both';

export interface FeatureFlag {
  id: string;
  clientId?: string;
  key: string;
  description: string;
  descriptionRu?: string;
  descriptionUk?: string;
  enabled: boolean;
  audience: FlagAudience;
  rolloutPct: number;
  updatedAt: string;
}

export interface FeatureFlagCreateInput {
  clientId?: string;
  key: string;
  description: string;
  descriptionRu?: string;
  descriptionUk?: string;
  enabled?: boolean;
  audience?: FlagAudience;
  rolloutPct?: number;
}

export const flagAudienceLabels: Record<FlagAudience, { en: string; ru: string; uk: string }> = {
  staff: { en: 'Staff Only', ru: 'Только сотрудники', uk: 'Тільки співробітники' },
  client: { en: 'Clients Only', ru: 'Только клиенты', uk: 'Тільки клієнти' },
  both: { en: 'Everyone', ru: 'Все', uk: 'Всі' },
};

// Predefined feature flags
export const KNOWN_FLAGS = {
  SHOW_AI_ADVANCED: 'showAiAdvanced',
  SHOW_API_MODULE: 'showApiModule',
  SHOW_REPORTING_STUDIO: 'showReportingStudio',
  SHOW_RISK_ANALYTICS: 'showRiskAnalytics',
  SHOW_TAX_HARVESTING: 'showTaxHarvesting',
  ENABLE_DARK_MODE: 'enableDarkMode',
  ENABLE_EXPORT_PDF: 'enableExportPdf',
  ENABLE_BULK_ACTIONS: 'enableBulkActions',
  SHOW_BETA_FEATURES: 'showBetaFeatures',
  ENABLE_WEBHOOKS: 'enableWebhooks',
} as const;

export function isFlagEnabled(
  flags: FeatureFlag[],
  key: string,
  isStaff: boolean = true
): boolean {
  const flag = flags.find(f => f.key === key);
  if (!flag) return false;
  if (!flag.enabled) return false;

  // Check audience
  if (flag.audience === 'staff' && !isStaff) return false;
  if (flag.audience === 'client' && isStaff) return false;

  // Check rollout percentage (simplified - in production would use user hash)
  if (flag.rolloutPct < 100) {
    const random = Math.random() * 100;
    return random < flag.rolloutPct;
  }

  return true;
}

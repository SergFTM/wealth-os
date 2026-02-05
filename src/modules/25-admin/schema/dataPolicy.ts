/**
 * Data Policy Schema
 * Retention, export, and privacy settings
 */

export type PrivacyMode = 'standard' | 'strict' | 'minimal';
export type ResidencyRegion = 'us' | 'eu' | 'apac' | 'global';

export interface DataPolicy {
  id: string;
  clientId?: string;
  retentionDays: number;
  exportAllowed: boolean;
  residencyRegion: ResidencyRegion;
  privacyMode: PrivacyMode;
  backupsEnabled: boolean;
  encryptionAtRest: boolean;
  auditLogRetentionDays: number;
  piiMaskingEnabled: boolean;
  updatedAt: string;
}

export interface DataPolicyCreateInput {
  clientId?: string;
  retentionDays?: number;
  exportAllowed?: boolean;
  residencyRegion?: ResidencyRegion;
  privacyMode?: PrivacyMode;
  backupsEnabled?: boolean;
  encryptionAtRest?: boolean;
  auditLogRetentionDays?: number;
  piiMaskingEnabled?: boolean;
}

export const privacyModeLabels: Record<PrivacyMode, { en: string; ru: string; uk: string }> = {
  standard: { en: 'Standard', ru: 'Стандартный', uk: 'Стандартний' },
  strict: { en: 'Strict', ru: 'Строгий', uk: 'Суворий' },
  minimal: { en: 'Minimal Collection', ru: 'Минимальный сбор', uk: 'Мінімальний збір' },
};

export const residencyRegionLabels: Record<ResidencyRegion, { en: string; ru: string; uk: string }> = {
  us: { en: 'United States', ru: 'США', uk: 'США' },
  eu: { en: 'European Union', ru: 'Европейский Союз', uk: 'Європейський Союз' },
  apac: { en: 'Asia Pacific', ru: 'Азиатско-Тихоокеанский', uk: 'Азійсько-Тихоокеанський' },
  global: { en: 'Global (Multi-region)', ru: 'Глобальный (мультирегион)', uk: 'Глобальний (мультирегіон)' },
};

export const DEFAULT_DATA_POLICY: Partial<DataPolicy> = {
  retentionDays: 2555, // 7 years
  exportAllowed: true,
  residencyRegion: 'us',
  privacyMode: 'standard',
  backupsEnabled: true,
  encryptionAtRest: true,
  auditLogRetentionDays: 365,
  piiMaskingEnabled: false,
};

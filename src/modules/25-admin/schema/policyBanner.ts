/**
 * Policy Banner Schema
 * Disclaimers and legal notices by module
 */

export type PolicyModuleKey = 'tax' | 'trusts' | 'ai' | 'api' | 'reports' | 'global';
export type PolicySeverity = 'info' | 'warn';
export type PolicyPlacement = 'top-banner' | 'section-footer' | 'modal';
export type PolicyStatus = 'active' | 'inactive';

export interface PolicyBanner {
  id: string;
  clientId?: string;
  moduleKey: PolicyModuleKey;
  severity: PolicySeverity;
  placement: PolicyPlacement;
  textRu: string;
  textEn: string;
  textUk: string;
  status: PolicyStatus;
  order: number;
  updatedAt: string;
}

export interface PolicyBannerCreateInput {
  clientId?: string;
  moduleKey: PolicyModuleKey;
  severity?: PolicySeverity;
  placement?: PolicyPlacement;
  textRu: string;
  textEn?: string;
  textUk?: string;
  status?: PolicyStatus;
  order?: number;
}

export const policyModuleLabels: Record<PolicyModuleKey, { en: string; ru: string; uk: string }> = {
  tax: { en: 'Tax', ru: 'Налоги', uk: 'Податки' },
  trusts: { en: 'Trusts', ru: 'Трасты', uk: 'Трасти' },
  ai: { en: 'AI', ru: 'ИИ', uk: 'ШІ' },
  api: { en: 'API', ru: 'API', uk: 'API' },
  reports: { en: 'Reports', ru: 'Отчеты', uk: 'Звіти' },
  global: { en: 'Global', ru: 'Глобальный', uk: 'Глобальний' },
};

export const policySeverityLabels: Record<PolicySeverity, { en: string; ru: string; uk: string }> = {
  info: { en: 'Info', ru: 'Информация', uk: 'Інформація' },
  warn: { en: 'Warning', ru: 'Предупреждение', uk: 'Попередження' },
};

export const policyPlacementLabels: Record<PolicyPlacement, { en: string; ru: string; uk: string }> = {
  'top-banner': { en: 'Top Banner', ru: 'Верхний баннер', uk: 'Верхній банер' },
  'section-footer': { en: 'Section Footer', ru: 'Футер секции', uk: 'Футер секції' },
  'modal': { en: 'Modal', ru: 'Модальное окно', uk: 'Модальне вікно' },
};

export const ALL_POLICY_MODULES: PolicyModuleKey[] = ['tax', 'trusts', 'ai', 'api', 'reports', 'global'];

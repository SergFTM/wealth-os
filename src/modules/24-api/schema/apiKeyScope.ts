/**
 * API Key Scope Schema
 * Defines permissions for an API key
 */

export type ActionKey = 'view' | 'create' | 'edit' | 'approve' | 'export';
export type ScopeType = 'global' | 'household' | 'entity' | 'portfolio';

export interface ApiKeyScope {
  id: string;
  apiKeyId: string;
  moduleKey: string;
  actionKey: ActionKey;
  scopeType: ScopeType;
  scopeId?: string;
  clientSafe: boolean;
  createdAt: string;
}

export interface ApiKeyScopeCreateInput {
  apiKeyId: string;
  moduleKey: string;
  actionKey: ActionKey;
  scopeType: ScopeType;
  scopeId?: string;
  clientSafe?: boolean;
}

export const actionKeyLabels: Record<ActionKey, { en: string; ru: string; uk: string }> = {
  view: { en: 'View', ru: 'Просмотр', uk: 'Перегляд' },
  create: { en: 'Create', ru: 'Создание', uk: 'Створення' },
  edit: { en: 'Edit', ru: 'Редактирование', uk: 'Редагування' },
  approve: { en: 'Approve', ru: 'Утверждение', uk: 'Затвердження' },
  export: { en: 'Export', ru: 'Экспорт', uk: 'Експорт' },
};

export const scopeTypeLabels: Record<ScopeType, { en: string; ru: string; uk: string }> = {
  global: { en: 'Global', ru: 'Глобальный', uk: 'Глобальний' },
  household: { en: 'Household', ru: 'Домохозяйство', uk: 'Домогосподарство' },
  entity: { en: 'Entity', ru: 'Структура', uk: 'Структура' },
  portfolio: { en: 'Portfolio', ru: 'Портфель', uk: 'Портфель' },
};

export const availableModules = [
  'net-worth',
  'performance',
  'general-ledger',
  'partnerships',
  'private-capital',
  'liquidity',
  'documents',
  'fees',
  'workflow',
  'ips',
  'risk',
  'tax',
  'trusts',
  'invoices',
  'tasks',
];

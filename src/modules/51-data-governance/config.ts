import { ModuleConfig } from '../types';

export const dataGovernanceConfig: ModuleConfig = {
  id: '51',
  slug: 'governance-data',
  order: 51,
  icon: 'database',
  color: 'emerald',
  enabled: true,

  title: {
    ru: 'Data Governance',
    en: 'Data Governance',
    uk: 'Data Governance',
  },

  description: {
    ru: 'Управление качеством данных, lineage, объяснение цифр, сверки и trust badges',
    en: 'Data quality management, lineage, number explanations, reconciliations and trust badges',
    uk: 'Управління якістю даних, lineage, пояснення цифр, звірки та trust badges',
  },

  disclaimer: {
    ru: 'Пояснения носят информационный характер. Финальные выводы требуют проверки бухгалтером и ответственными лицами.',
    en: 'Explanations are informational. Final conclusions require verification by an accountant and responsible persons.',
    uk: 'Пояснення носять інформаційний характер. Фінальні висновки потребують перевірки бухгалтером та відповідальними особами.',
  },

  kpis: [
    { key: 'kpisTracked', title: { ru: 'KPI отслеживается', en: 'KPIs Tracked', uk: 'KPI відстежується' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'verifiedKpis', title: { ru: 'Verified KPIs', en: 'Verified KPIs', uk: 'Verified KPIs' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'staleKpis', title: { ru: 'Stale KPIs', en: 'Stale KPIs', uk: 'Stale KPIs' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'lowQualityScores', title: { ru: 'Низкое качество', en: 'Low Quality', uk: 'Низька якість' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'reconBreaksOpen', title: { ru: 'Расхождения', en: 'Recon Breaks', uk: 'Розбіжності' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'overridesPending', title: { ru: 'Ожидают одобрения', en: 'Overrides Pending', uk: 'Очікують схвалення' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'rulesEnabled', title: { ru: 'Правил активно', en: 'Rules Enabled', uk: 'Правил активно' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'exceptions7d', title: { ru: 'Exceptions 7д', en: 'Exceptions 7d', uk: 'Exceptions 7д' }, format: 'number', status: 'warning', linkToList: true },
  ],

  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' }, width: 'w-48' },
    { key: 'domain', header: { ru: 'Домен', en: 'Domain', uk: 'Домен' }, width: 'w-32' },
    { key: 'asOf', header: { ru: 'As-of', en: 'As-of', uk: 'As-of' }, type: 'date', width: 'w-28' },
    { key: 'trustBadge', header: { ru: 'Trust Badge', en: 'Trust Badge', uk: 'Trust Badge' }, type: 'badge', width: 'w-24' },
    { key: 'qualityScore', header: { ru: 'Quality Score', en: 'Quality Score', uk: 'Quality Score' }, width: 'w-24' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status', width: 'w-24' },
  ],

  actions: [
    { key: 'createKpi', label: { ru: 'Создать KPI', en: 'Create KPI', uk: 'Створити KPI' }, icon: 'plus', variant: 'primary' },
    { key: 'defineLineage', label: { ru: 'Определить Lineage', en: 'Define Lineage', uk: 'Визначити Lineage' }, icon: 'git-branch', variant: 'secondary' },
    { key: 'runQuality', label: { ru: 'Запустить Quality', en: 'Run Quality', uk: 'Запустити Quality' }, icon: 'check', variant: 'secondary' },
    { key: 'runRecon', label: { ru: 'Запустить Recon', en: 'Run Recon', uk: 'Запустити Recon' }, icon: 'scale', variant: 'secondary' },
    { key: 'createOverride', label: { ru: 'Создать Override', en: 'Create Override', uk: 'Створити Override' }, icon: 'edit', variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Demo данные', en: 'Demo Data', uk: 'Demo дані' }, icon: 'flask', variant: 'ghost' },
  ],

  tabs: [
    { key: 'kpis', label: { ru: 'KPIs', en: 'KPIs', uk: 'KPIs' } },
    { key: 'lineage', label: { ru: 'Lineage', en: 'Lineage', uk: 'Lineage' } },
    { key: 'quality', label: { ru: 'Quality Scores', en: 'Quality Scores', uk: 'Quality Scores' } },
    { key: 'recons', label: { ru: 'Сверки', en: 'Reconciliations', uk: 'Звірки' } },
    { key: 'overrides', label: { ru: 'Overrides', en: 'Overrides', uk: 'Overrides' } },
    { key: 'rules', label: { ru: 'Правила', en: 'Rules', uk: 'Правила' } },
    { key: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
  ],

  collections: [
    'dataKpis',
    'dataLineage',
    'dataQualityScores',
    'dataReconciliations',
    'dataOverrides',
    'dataGovernanceRules',
    'auditEvents',
  ],

  routes: {
    dashboard: '/m/governance-data',
    list: '/m/governance-data/list',
    kpiDetail: '/m/governance-data/kpi/[id]',
    lineageDetail: '/m/governance-data/lineage/[id]',
    reconDetail: '/m/governance-data/recon/[id]',
    overrideDetail: '/m/governance-data/override/[id]',
    ruleDetail: '/m/governance-data/rule/[id]',
  },

  adminOnly: false,
  clientSafeHidden: true,
};

// Domain keys for KPIs
export const KPI_DOMAINS = {
  netWorth: { ru: 'Net Worth', en: 'Net Worth', uk: 'Net Worth' },
  performance: { ru: 'Performance', en: 'Performance', uk: 'Performance' },
  liquidity: { ru: 'Liquidity', en: 'Liquidity', uk: 'Liquidity' },
  gl: { ru: 'GL', en: 'GL', uk: 'GL' },
  tax: { ru: 'Tax', en: 'Tax', uk: 'Tax' },
  risk: { ru: 'Risk', en: 'Risk', uk: 'Risk' },
  compliance: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' },
} as const;

// Trust badge keys
export const TRUST_BADGES = {
  verified: { ru: 'Verified', en: 'Verified', uk: 'Verified', color: 'emerald' },
  estimated: { ru: 'Estimated', en: 'Estimated', uk: 'Estimated', color: 'amber' },
  stale: { ru: 'Stale', en: 'Stale', uk: 'Stale', color: 'red' },
} as const;

// Reconciliation types
export const RECON_TYPES = {
  ibor_abor: { ru: 'IBOR vs ABOR', en: 'IBOR vs ABOR', uk: 'IBOR vs ABOR' },
  cash_bank: { ru: 'Cash vs Bank', en: 'Cash vs Bank', uk: 'Cash vs Bank' },
  positions_custodian: { ru: 'Positions vs Custodian', en: 'Positions vs Custodian', uk: 'Positions vs Custodian' },
  gl_subledger: { ru: 'GL vs Subledger', en: 'GL vs Subledger', uk: 'GL vs Subledger' },
} as const;

// Override types
export const OVERRIDE_TYPES = {
  adjustment: { ru: 'Корректировка', en: 'Adjustment', uk: 'Коригування' },
  reclass: { ru: 'Реклассификация', en: 'Reclassification', uk: 'Рекласифікація' },
  mapping_fix: { ru: 'Исправление маппинга', en: 'Mapping Fix', uk: 'Виправлення мапінгу' },
} as const;

// Override statuses
export const OVERRIDE_STATUSES = {
  draft: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' },
  pending: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує' },
  approved: { ru: 'Одобрено', en: 'Approved', uk: 'Схвалено' },
  rejected: { ru: 'Отклонено', en: 'Rejected', uk: 'Відхилено' },
  applied: { ru: 'Применено', en: 'Applied', uk: 'Застосовано' },
} as const;

// Quality score thresholds
export const QUALITY_THRESHOLDS = {
  high: 80,
  medium: 60,
  low: 40,
} as const;

// Rule types
export const RULE_TYPES = {
  quality_threshold: { ru: 'Порог качества', en: 'Quality Threshold', uk: 'Поріг якості' },
  stale_threshold: { ru: 'Порог устаревания', en: 'Stale Threshold', uk: 'Поріг застарівання' },
  recon_threshold: { ru: 'Порог расхождения', en: 'Recon Threshold', uk: 'Поріг розбіжності' },
  emit_exception: { ru: 'Генерация исключения', en: 'Emit Exception', uk: 'Генерація виключення' },
} as const;

// Recon statuses
export const RECON_STATUSES = {
  ok: { ru: 'OK', en: 'OK', uk: 'OK', color: 'emerald' },
  break: { ru: 'Break', en: 'Break', uk: 'Break', color: 'red' },
  pending: { ru: 'Pending', en: 'Pending', uk: 'Pending', color: 'amber' },
} as const;

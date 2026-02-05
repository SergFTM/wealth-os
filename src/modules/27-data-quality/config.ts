/**
 * Module 27: Data Quality and Observability
 * Контроль целостности данных, синхронизаций, конфликтов и качества источников
 */

import { ModuleConfig } from '../types';

export const dataQualityConfig: ModuleConfig = {
  id: 'data-quality',
  slug: 'data-quality',
  title: { ru: 'Качество данных', en: 'Data Quality', uk: 'Якість даних' },
  description: {
    ru: 'Контроль целостности данных и мониторинг синхронизаций',
    en: 'Data integrity control and sync monitoring',
    uk: 'Контроль цілісності даних та моніторинг синхронізацій',
  },
  icon: '🔍',
  color: 'emerald',
  order: 27,
  enabled: true,
  collections: [
    'dqRules',
    'dqRuns',
    'dqExceptions',
    'dqConflicts',
    'dqSyncJobs',
    'dqReconChecks',
    'dqMetrics',
  ],
  routes: {
    dashboard: '/m/data-quality',
    list: '/m/data-quality/list',
    ruleDetail: '/m/data-quality/rule/[id]',
    exceptionDetail: '/m/data-quality/exception/[id]',
    conflictDetail: '/m/data-quality/conflict/[id]',
    jobDetail: '/m/data-quality/job/[id]',
  },
  tabs: [
    { key: 'health', label: { ru: 'Здоровье', en: 'Health', uk: 'Здоров\'я' } },
    { key: 'rules', label: { ru: 'Правила', en: 'Rules', uk: 'Правила' } },
    { key: 'exceptions', label: { ru: 'Исключения', en: 'Exceptions', uk: 'Винятки' } },
    { key: 'conflicts', label: { ru: 'Конфликты', en: 'Conflicts', uk: 'Конфлікти' } },
    { key: 'jobs', label: { ru: 'Синхронизации', en: 'Sync Jobs', uk: 'Синхронізації' } },
    { key: 'recon', label: { ru: 'Сверки', en: 'Reconciliation', uk: 'Звірки' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } },
  ],
  disclaimer: {
    ru: 'Проверки качества данных в MVP демонстрационные и не заменяют полный аудит данных',
    en: 'Data quality checks in MVP are demonstrative and do not replace full data audit',
    uk: 'Перевірки якості даних в MVP демонстраційні і не замінюють повний аудит даних',
  },
};

export const DQ_DOMAINS = {
  aggregation: {
    label: { ru: 'Агрегация и Net Worth', en: 'Aggregation & Net Worth', uk: 'Агрегація та Net Worth' },
    icon: '💰',
    collections: ['aggregationSnapshots', 'netWorthHistory'],
  },
  gl: {
    label: { ru: 'GL и Учёт', en: 'GL & Accounting', uk: 'GL та Облік' },
    icon: '📒',
    collections: ['glTransactions', 'glAccounts', 'glJournals'],
  },
  performance: {
    label: { ru: 'Перформанс', en: 'Performance', uk: 'Перформанс' },
    icon: '📈',
    collections: ['performanceSnapshots', 'benchmarks'],
  },
  privateCapital: {
    label: { ru: 'Прямые инвестиции', en: 'Private Capital', uk: 'Прямі інвестиції' },
    icon: '🏢',
    collections: ['pcInvestments', 'pcCapitalCalls'],
  },
  docs: {
    label: { ru: 'Документы', en: 'Documents', uk: 'Документи' },
    icon: '📄',
    collections: ['documents', 'documentVersions'],
  },
  payments: {
    label: { ru: 'Платежи', en: 'Payments', uk: 'Платежі' },
    icon: '💳',
    collections: ['invoices', 'payments', 'obligations'],
  },
  integrations: {
    label: { ru: 'Интеграции', en: 'Integrations', uk: 'Інтеграції' },
    icon: '🔗',
    collections: ['connectors', 'syncJobs'],
  },
} as const;

export type DqDomain = keyof typeof DQ_DOMAINS;

export const DQ_SEVERITY = {
  ok: { label: { ru: 'ОК', en: 'OK', uk: 'ОК' }, color: 'emerald', weight: 0 },
  info: { label: { ru: 'Инфо', en: 'Info', uk: 'Інфо' }, color: 'blue', weight: 1 },
  warning: { label: { ru: 'Внимание', en: 'Warning', uk: 'Увага' }, color: 'amber', weight: 5 },
  critical: { label: { ru: 'Критично', en: 'Critical', uk: 'Критично' }, color: 'red', weight: 20 },
} as const;

export type DqSeverity = keyof typeof DQ_SEVERITY;

export const DQ_RULE_TYPES = {
  missing_field: { label: { ru: 'Отсутствует поле', en: 'Missing Field', uk: 'Відсутнє поле' } },
  invalid_currency: { label: { ru: 'Неверная валюта', en: 'Invalid Currency', uk: 'Невірна валюта' } },
  duplicate: { label: { ru: 'Дубликат', en: 'Duplicate', uk: 'Дублікат' } },
  mismatch_sum: { label: { ru: 'Несовпадение суммы', en: 'Sum Mismatch', uk: 'Невідповідність суми' } },
  stale_as_of: { label: { ru: 'Устаревшие данные', en: 'Stale Data', uk: 'Застарілі дані' } },
  invalid_reference: { label: { ru: 'Неверная ссылка', en: 'Invalid Reference', uk: 'Невірне посилання' } },
  range_violation: { label: { ru: 'Вне диапазона', en: 'Range Violation', uk: 'Поза діапазоном' } },
  format_error: { label: { ru: 'Ошибка формата', en: 'Format Error', uk: 'Помилка формату' } },
} as const;

export type DqRuleType = keyof typeof DQ_RULE_TYPES;

export const DQ_CONFLICT_TYPES = {
  duplicate_tx: { label: { ru: 'Дубль транзакции', en: 'Duplicate Transaction', uk: 'Дублікат транзакції' } },
  currency_mismatch: { label: { ru: 'Несовпадение валют', en: 'Currency Mismatch', uk: 'Невідповідність валют' } },
  owner_missing: { label: { ru: 'Нет владельца', en: 'Missing Owner', uk: 'Відсутній власник' } },
  position_mismatch: { label: { ru: 'Несовпадение позиций', en: 'Position Mismatch', uk: 'Невідповідність позицій' } },
  amount_discrepancy: { label: { ru: 'Расхождение сумм', en: 'Amount Discrepancy', uk: 'Розбіжність сум' } },
} as const;

export type DqConflictType = keyof typeof DQ_CONFLICT_TYPES;

export const DQ_RECON_TYPES = {
  ibor_abor: {
    label: { ru: 'IBOR vs ABOR', en: 'IBOR vs ABOR', uk: 'IBOR vs ABOR' },
    description: { ru: 'Сравнение позиций', en: 'Compare positions', uk: 'Порівняння позицій' },
  },
  bank_ledger: {
    label: { ru: 'Банк vs Ledger', en: 'Bank vs Ledger', uk: 'Банк vs Ledger' },
    description: { ru: 'Сверка банковских выписок', en: 'Bank statement reconciliation', uk: 'Звірка банківських виписок' },
  },
  positions_statements: {
    label: { ru: 'Позиции vs Отчёты', en: 'Positions vs Statements', uk: 'Позиції vs Звіти' },
    description: { ru: 'Сверка позиций с отчётами', en: 'Position vs statement check', uk: 'Звірка позицій зі звітами' },
  },
} as const;

export type DqReconType = keyof typeof DQ_RECON_TYPES;

export const DQ_SLA = {
  critical: { hours: 24, label: { ru: '24 часа', en: '24 hours', uk: '24 години' } },
  warning: { hours: 72, label: { ru: '72 часа', en: '72 hours', uk: '72 години' } },
  info: { hours: 168, label: { ru: '7 дней', en: '7 days', uk: '7 днів' } },
  ok: { hours: 336, label: { ru: '14 дней', en: '14 days', uk: '14 днів' } },
} as const;

export default dataQualityConfig;

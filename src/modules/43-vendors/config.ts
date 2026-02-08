import { ModuleConfig } from '../types';

// Vendor type enums
export const VendorType = {
  BANK: 'bank',
  BROKER: 'broker',
  AUDITOR: 'auditor',
  LEGAL: 'legal',
  TAX_ADVISOR: 'tax_advisor',
  CUSTODIAN: 'custodian',
  IT: 'it',
  INSURANCE: 'insurance',
  CONSULTANT: 'consultant',
  OTHER: 'other',
} as const;

export type VendorTypeKey = typeof VendorType[keyof typeof VendorType];

export const VendorTypeLabels: Record<VendorTypeKey, Record<string, string>> = {
  bank: { ru: 'Банк', en: 'Bank', uk: 'Банк' },
  broker: { ru: 'Брокер', en: 'Broker', uk: 'Брокер' },
  auditor: { ru: 'Аудитор', en: 'Auditor', uk: 'Аудитор' },
  legal: { ru: 'Юрист', en: 'Legal', uk: 'Юрист' },
  tax_advisor: { ru: 'Налоговый консультант', en: 'Tax Advisor', uk: 'Податковий консультант' },
  custodian: { ru: 'Кастодиан', en: 'Custodian', uk: 'Кастодіан' },
  it: { ru: 'IT провайдер', en: 'IT Provider', uk: 'IT провайдер' },
  insurance: { ru: 'Страхование', en: 'Insurance', uk: 'Страхування' },
  consultant: { ru: 'Консультант', en: 'Consultant', uk: 'Консультант' },
  other: { ru: 'Другое', en: 'Other', uk: 'Інше' },
};

// Vendor status
export const VendorStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ONBOARDING: 'onboarding',
  TERMINATED: 'terminated',
} as const;

export type VendorStatusKey = typeof VendorStatus[keyof typeof VendorStatus];

// Contract status
export const ContractStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  EXPIRING: 'expiring',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
} as const;

export type ContractStatusKey = typeof ContractStatus[keyof typeof ContractStatus];

// Fee model
export const FeeModel = {
  FIXED: 'fixed',
  AUM: 'aum',
  HOURLY: 'hourly',
  TRANSACTION: 'transaction',
  RETAINER: 'retainer',
  HYBRID: 'hybrid',
} as const;

export type FeeModelKey = typeof FeeModel[keyof typeof FeeModel];

// SLA status
export const SlaStatus = {
  OK: 'ok',
  WARNING: 'warning',
  BREACHED: 'breached',
} as const;

export type SlaStatusKey = typeof SlaStatus[keyof typeof SlaStatus];

// Incident severity
export const IncidentSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type IncidentSeverityKey = typeof IncidentSeverity[keyof typeof IncidentSeverity];

// Incident status
export const IncidentStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type IncidentStatusKey = typeof IncidentStatus[keyof typeof IncidentStatus];

// Risk rating
export const RiskRating = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type RiskRatingKey = typeof RiskRating[keyof typeof RiskRating];

export const vendorsConfig: ModuleConfig = {
  id: '43',
  slug: 'vendors',
  order: 43,
  icon: 'briefcase',
  title: { ru: 'Провайдеры', en: 'Vendors', uk: 'Провайдери' },
  description: {
    ru: 'Управление внешними провайдерами, контрактами, SLA, scorecards и инцидентами',
    en: 'Vendor management, contracts, SLAs, scorecards and incidents',
    uk: 'Управління зовнішніми провайдерами, контрактами, SLA, scorecards і інцидентами',
  },
  disclaimer: {
    ru: 'Информация о провайдерах демонстрационная. Контракты требуют юридической проверки.',
    en: 'Vendor information is for demonstration only. Contracts require legal review.',
    uk: 'Інформація про провайдерів демонстраційна. Контракти потребують юридичної перевірки.',
  },
  color: '#059669',
  enabled: true,
  collections: [
    'vdVendors',
    'vdContracts',
    'vdSlas',
    'vdScorecards',
    'vdIncidents',
    'vdInvoices',
  ],
  kpis: [
    { key: 'activeVendors', title: { ru: 'Активные провайдеры', en: 'Active Vendors', uk: 'Активні провайдери' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'contractsRenew90d', title: { ru: 'Продление 90д', en: 'Renewing 90d', uk: 'Продовження 90д' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'slaBreaches30d', title: { ru: 'SLA нарушения 30д', en: 'SLA Breaches 30d', uk: 'SLA порушення 30д' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'incidentsOpen', title: { ru: 'Открытые инциденты', en: 'Open Incidents', uk: 'Відкриті інциденти' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'highSpendVendors', title: { ru: 'Топ по расходам', en: 'High Spend', uk: 'Топ за витратами' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'feeAnomalies', title: { ru: 'Fee аномалии', en: 'Fee Anomalies', uk: 'Fee аномалії' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'accessActive', title: { ru: 'Доступы активны', en: 'Access Active', uk: 'Доступи активні' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'scorecardsLow', title: { ru: 'Низкие scorecards', en: 'Low Scorecards', uk: 'Низькі scorecards' }, format: 'number', status: 'critical', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Провайдер', en: 'Vendor', uk: 'Провайдер' } },
    { key: 'vendorType', header: { ru: 'Тип', en: 'Type', uk: 'Тип' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'primaryContact', header: { ru: 'Контакт', en: 'Contact', uk: 'Контакт' } },
    { key: 'riskRating', header: { ru: 'Риск', en: 'Risk', uk: 'Ризик' }, type: 'badge' },
    { key: 'contractsCount', header: { ru: 'Контракты', en: 'Contracts', uk: 'Контракти' } },
    { key: 'spendYtd', header: { ru: 'Расход YTD', en: 'Spend YTD', uk: 'Витрати YTD' }, type: 'currency' },
  ],
  tabs: [
    { key: 'vendors', label: { ru: 'Провайдеры', en: 'Vendors', uk: 'Провайдери' } },
    { key: 'contracts', label: { ru: 'Контракты', en: 'Contracts', uk: 'Контракти' } },
    { key: 'slas', label: { ru: 'SLA', en: 'SLAs', uk: 'SLA' } },
    { key: 'scorecards', label: { ru: 'Scorecards', en: 'Scorecards', uk: 'Scorecards' } },
    { key: 'incidents', label: { ru: 'Инциденты', en: 'Incidents', uk: 'Інциденти' } },
    { key: 'invoices', label: { ru: 'Счета', en: 'Invoices', uk: 'Рахунки' } },
    { key: 'access', label: { ru: 'Доступ', en: 'Access', uk: 'Доступ' } },
    { key: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
  ],
  actions: [
    { key: 'createVendor', label: { ru: 'Создать провайдера', en: 'Create Vendor', uk: 'Створити провайдера' }, variant: 'primary' },
    { key: 'createContract', label: { ru: 'Создать контракт', en: 'Create Contract', uk: 'Створити контракт' }, variant: 'secondary' },
    { key: 'addSla', label: { ru: 'Добавить SLA', en: 'Add SLA', uk: 'Додати SLA' }, variant: 'secondary' },
    { key: 'createIncident', label: { ru: 'Создать инцидент', en: 'Create Incident', uk: 'Створити інцидент' }, variant: 'secondary' },
    { key: 'createScorecard', label: { ru: 'Создать scorecard', en: 'Create Scorecard', uk: 'Створити scorecard' }, variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Demo провайдеры', en: 'Demo Vendors', uk: 'Demo провайдери' }, variant: 'ghost' },
  ],
  routes: {
    dashboard: '/m/vendors',
    list: '/m/vendors/list',
    vendor: '/m/vendors/vendor/[id]',
    contract: '/m/vendors/contract/[id]',
    scorecard: '/m/vendors/scorecard/[id]',
    incident: '/m/vendors/incident/[id]',
  },
};

export const config = vendorsConfig;

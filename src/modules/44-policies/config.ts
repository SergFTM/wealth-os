import { ModuleConfig } from '../types';

// Policy category enums
export const PolicyCategory = {
  INVESTMENT: 'investment',
  COMPLIANCE: 'compliance',
  SECURITY: 'security',
  OPERATIONS: 'operations',
  VENDOR: 'vendor',
} as const;

export type PolicyCategoryKey = typeof PolicyCategory[keyof typeof PolicyCategory];

export const PolicyCategoryLabels: Record<PolicyCategoryKey, Record<string, string>> = {
  investment: { ru: 'Инвестиционная', en: 'Investment', uk: 'Інвестиційна' },
  compliance: { ru: 'Комплаенс', en: 'Compliance', uk: 'Комплаєнс' },
  security: { ru: 'Безопасность', en: 'Security', uk: 'Безпека' },
  operations: { ru: 'Операционная', en: 'Operations', uk: 'Операційна' },
  vendor: { ru: 'Вендорская', en: 'Vendor', uk: 'Вендорська' },
};

// Policy status
export const PolicyStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type PolicyStatusKey = typeof PolicyStatus[keyof typeof PolicyStatus];

// SOP process types
export const SopProcess = {
  BILL_PAY: 'bill_pay',
  ONBOARDING: 'onboarding',
  APPROVALS: 'approvals',
  INCIDENT_RESPONSE: 'incident_response',
  DATA_BACKUP: 'data_backup',
  CLIENT_REPORTING: 'client_reporting',
  VENDOR_REVIEW: 'vendor_review',
  RECONCILIATION: 'reconciliation',
} as const;

export type SopProcessKey = typeof SopProcess[keyof typeof SopProcess];

export const SopProcessLabels: Record<SopProcessKey, Record<string, string>> = {
  bill_pay: { ru: 'Оплата счетов', en: 'Bill Pay', uk: 'Оплата рахунків' },
  onboarding: { ru: 'Онбординг', en: 'Onboarding', uk: 'Онбординг' },
  approvals: { ru: 'Согласования', en: 'Approvals', uk: 'Погодження' },
  incident_response: { ru: 'Реагирование на инциденты', en: 'Incident Response', uk: 'Реагування на інциденти' },
  data_backup: { ru: 'Резервное копирование', en: 'Data Backup', uk: 'Резервне копіювання' },
  client_reporting: { ru: 'Клиентская отчетность', en: 'Client Reporting', uk: 'Клієнтська звітність' },
  vendor_review: { ru: 'Обзор вендоров', en: 'Vendor Review', uk: 'Огляд вендорів' },
  reconciliation: { ru: 'Сверка', en: 'Reconciliation', uk: 'Звірка' },
};

// Version status
export const VersionStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  RETIRED: 'retired',
} as const;

export type VersionStatusKey = typeof VersionStatus[keyof typeof VersionStatus];

// Acknowledgement status
export const AckStatus = {
  REQUESTED: 'requested',
  ACKNOWLEDGED: 'acknowledged',
  OVERDUE: 'overdue',
} as const;

export type AckStatusKey = typeof AckStatus[keyof typeof AckStatus];

// Link types
export const LinkType = {
  CASE: 'case',
  INCIDENT: 'incident',
  BREACH: 'breach',
  IPS: 'ips',
} as const;

export type LinkTypeKey = typeof LinkType[keyof typeof LinkType];

export const policiesConfig: ModuleConfig = {
  id: '44',
  slug: 'policies',
  order: 44,
  icon: 'file-text',
  title: { ru: 'Политики', en: 'Policies', uk: 'Політики' },
  description: {
    ru: 'Центр политик, процедур и SOP — единый репозиторий всех регламентирующих документов',
    en: 'Policies and SOP Center — unified repository for all governance documents',
    uk: 'Центр політик, процедур і SOP — єдиний репозиторій всіх регламентуючих документів',
  },
  disclaimer: {
    ru: 'Политики и SOP демонстрационные. Юридически значимые документы требуют утверждения.',
    en: 'Policies and SOPs are for demonstration only. Legally binding documents require formal approval.',
    uk: 'Політики і SOP демонстраційні. Юридично значущі документи потребують затвердження.',
  },
  color: '#059669',
  enabled: true,
  collections: [
    'plPolicies',
    'plSops',
    'plVersions',
    'plAcknowledgements',
    'plChecklists',
    'plLinks',
  ],
  kpis: [
    { key: 'policiesActive', title: { ru: 'Активные политики', en: 'Active Policies', uk: 'Активні політики' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'sopsActive', title: { ru: 'Активные SOP', en: 'Active SOPs', uk: 'Активні SOP' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'versionsPending', title: { ru: 'Черновики версий', en: 'Draft Versions', uk: 'Чернетки версій' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'acksOverdue', title: { ru: 'Просроченные подтв.', en: 'Overdue Acks', uk: 'Прострочені підтв.' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'checklistsUsed30d', title: { ru: 'Чеклисты 30д', en: 'Checklists 30d', uk: 'Чеклісти 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'linkedBreaches', title: { ru: 'Связи с breach', en: 'Linked Breaches', uk: "Зв'язки з breach" }, format: 'number', status: 'warning', linkToList: true },
    { key: 'clientSafePublished', title: { ru: 'Client-safe опубл.', en: 'Client-safe Pub.', uk: 'Client-safe опубл.' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingOwner', title: { ru: 'Без владельца', en: 'Missing Owner', uk: 'Без власника' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'title', header: { ru: 'Название', en: 'Title', uk: 'Назва' } },
    { key: 'categoryKey', header: { ru: 'Категория', en: 'Category', uk: 'Категорія' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'currentVersionLabel', header: { ru: 'Версия', en: 'Version', uk: 'Версія' } },
    { key: 'ownerName', header: { ru: 'Владелец', en: 'Owner', uk: 'Власник' } },
    { key: 'clientSafePublished', header: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' }, type: 'badge' },
  ],
  tabs: [
    { key: 'policies', label: { ru: 'Политики', en: 'Policies', uk: 'Політики' } },
    { key: 'sops', label: { ru: 'SOP', en: 'SOPs', uk: 'SOP' } },
    { key: 'versions', label: { ru: 'Версии', en: 'Versions', uk: 'Версії' } },
    { key: 'acknowledgements', label: { ru: 'Подтверждения', en: 'Acknowledgements', uk: 'Підтвердження' } },
    { key: 'checklists', label: { ru: 'Чеклисты', en: 'Checklists', uk: 'Чеклісти' } },
    { key: 'links', label: { ru: 'Связи', en: 'Links', uk: "Зв'язки" } },
    { key: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
  ],
  actions: [
    { key: 'createPolicy', label: { ru: 'Создать политику', en: 'Create Policy', uk: 'Створити політику' }, variant: 'primary' },
    { key: 'createSop', label: { ru: 'Создать SOP', en: 'Create SOP', uk: 'Створити SOP' }, variant: 'secondary' },
    { key: 'createVersion', label: { ru: 'Создать версию', en: 'Create Version', uk: 'Створити версію' }, variant: 'secondary' },
    { key: 'publish', label: { ru: 'Опубликовать', en: 'Publish', uk: 'Опублікувати' }, variant: 'secondary' },
    { key: 'requestAck', label: { ru: 'Запросить подтверждение', en: 'Request Acknowledgement', uk: 'Запросити підтвердження' }, variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Demo политики', en: 'Demo Policies', uk: 'Demo політики' }, variant: 'ghost' },
  ],
  routes: {
    dashboard: '/m/policies',
    list: '/m/policies/list',
    policy: '/m/policies/policy/[id]',
    sop: '/m/policies/sop/[id]',
    version: '/m/policies/version/[id]',
    checklist: '/m/policies/checklist/[id]',
  },
};

export const config = policiesConfig;

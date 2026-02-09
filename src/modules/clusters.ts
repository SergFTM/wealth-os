import { lm } from '@/lib/i18n';

export interface SidebarCluster {
  id: number;
  label: Record<string, string>;
  shortLabel?: Record<string, string>;
  hideHeader?: boolean;
}

export const SIDEBAR_CLUSTERS: SidebarCluster[] = [
  { id: 0, label: lm({ en: 'Dashboard', ru: 'Дашборд', uk: 'Дашборд' }), hideHeader: true },
  { id: 1, label: lm({ en: 'Data Aggregation & Management', ru: 'Агрегация и Управление Данными', uk: 'Агрегація та Управління Даними' }), shortLabel: lm({ en: 'Data', ru: 'Данные', uk: 'Дані' }) },
  { id: 2, label: lm({ en: 'Capital Structuring', ru: 'Структурирование Капитала', uk: 'Структурування Капіталу' }), shortLabel: lm({ en: 'Capital', ru: 'Капитал', uk: 'Капітал' }) },
  { id: 3, label: lm({ en: 'Portfolio & Analytics', ru: 'Портфель и Аналитика', uk: 'Портфель та Аналітика' }), shortLabel: lm({ en: 'Portfolio', ru: 'Портфель', uk: 'Портфель' }) },
  { id: 4, label: lm({ en: 'Accounting & Operations', ru: 'Учет и Операции', uk: 'Облік та Операції' }), shortLabel: lm({ en: 'Accounting', ru: 'Учёт', uk: 'Облік' }) },
  { id: 5, label: lm({ en: 'Documents & Communication', ru: 'Документы и Коммуникация', uk: 'Документи та Комунікація' }), shortLabel: lm({ en: 'Docs', ru: 'Документы', uk: 'Документи' }) },
  { id: 6, label: lm({ en: 'Compliance & Security', ru: 'Комплаенс и Безопасность', uk: 'Комплаєнс та Безпека' }), shortLabel: lm({ en: 'Compliance', ru: 'Комплаенс', uk: 'Комплаєнс' }) },
  { id: 7, label: lm({ en: 'Platform', ru: 'Платформа', uk: 'Платформа' }) },
];

export const SLUG_TO_CLUSTER: Record<string, number> = {
  // 0 — Dashboard
  'dashboard-home': 0,

  // 1 — Data Aggregation & Management
  'reconciliation': 1,
  'integrations': 1,
  'data-quality': 1,
  'mdm': 1,
  'exports': 1,
  'governance-data': 1,
  'exceptions': 1,

  // 2 — Capital Structuring & Visualization
  'net-worth': 2,
  'partnerships': 2,
  'trusts': 2,
  'ownership': 2,
  'relationships': 2,

  // 3 — Portfolio & Analytics
  'performance': 3,
  'private-capital': 3,
  'ips': 3,
  'risk': 3,
  'planning': 3,
  'ideas': 3,
  'liquidity': 3,
  'credit': 3,
  'deals': 3,
  'committee': 3,

  // 4 — Accounting & Operations
  'general-ledger': 4,
  'tax': 4,
  'fees': 4,
  'fee-billing': 4,
  'billpay-checks': 4,
  'ar-revenue': 4,
  'philanthropy': 4,

  // 5 — Documents & Communication
  'documents': 5,
  'reporting': 5,
  'communications': 5,
  'comms': 5,
  'reports': 5,
  'packs': 5,
  'calendar': 5,
  'portal': 5,
  'client-portal': 5,

  // 6 — Compliance & Security
  'onboarding': 6,
  'security': 6,
  'consents': 6,
  'consent': 6,
  'cases': 6,
  'governance': 6,
  'vendors': 6,
  'policies': 6,
  'workflow': 6,

  // 7 — Platform
  'ai': 7,
  'platform': 7,
  'api': 7,
  'admin': 7,
  'academy': 7,
  'sandbox': 7,
  'notifications': 7,
  'mobile': 7,
};

export const FALLBACK_CLUSTER_ID = 7;

export const HEADER_CLUSTER_IDS = [1, 2, 3, 4, 5, 6] as const;

/**
 * ReportSection Schema
 * Represents a section within a report pack
 */

export type SectionType =
  | 'cover'
  | 'toc'
  | 'executive-summary'
  | 'performance'
  | 'allocation'
  | 'holdings'
  | 'transactions'
  | 'fees'
  | 'risk'
  | 'compliance'
  | 'ips-status'
  | 'tax-summary'
  | 'liquidity'
  | 'trusts'
  | 'commentary'
  | 'ai-narrative'
  | 'appendix'
  | 'custom';

export type CategoryKey =
  | 'net_worth'
  | 'performance'
  | 'risk'
  | 'liquidity'
  | 'fees'
  | 'tax'
  | 'trusts'
  | 'ai'
  | 'custom';

export type SectionMode = 'auto' | 'manual';

export type DataSourceModule =
  | 'net-worth'
  | 'performance'
  | 'reconciliation'
  | 'general-ledger'
  | 'partnerships'
  | 'private-capital'
  | 'liquidity'
  | 'documents'
  | 'fees'
  | 'workflow'
  | 'ips'
  | 'risk'
  | 'tax'
  | 'trusts'
  | 'integrations'
  | 'ai'
  | 'custom';

export interface SectionDataSource {
  moduleKey: DataSourceModule;
  queryParams?: Record<string, string | number | boolean>;
  transformKey?: string;
}

export interface SourceRef {
  moduleKey: string;
  recordId?: string;
  label: string;
  asOf: string;
  link?: string;
  staffOnly?: boolean;
  clientVisible?: boolean;
}

export type DisclaimerType = 'tax' | 'legal' | 'ai' | 'general';

export interface SectionDisclaimer {
  type: DisclaimerType;
  text: string;
}

export interface ReportSection {
  id: string;
  packId: string;

  // Section details
  sectionType: SectionType;
  categoryKey: CategoryKey;
  title: string;
  subtitle?: string;
  order: number;

  // Mode: auto (resolved from data) or manual (user entered)
  mode: SectionMode;

  // Data source configuration
  dataSource?: SectionDataSource;

  // Content
  contentJson?: string;
  customContent?: string;

  // Sources
  sourcesJson: SourceRef[];
  asOf?: string;
  missingSources: boolean;

  // Disclaimers
  disclaimersJson: SectionDisclaimer[];

  // Client visibility
  clientVisible: boolean;

  // Display settings
  displayConfig?: {
    showTitle?: boolean;
    showSubtitle?: boolean;
    pageBreakBefore?: boolean;
    pageBreakAfter?: boolean;
    columns?: number;
    chartType?: string;
    layoutType?: 'cards' | 'table' | 'chart' | 'narrative' | 'mixed';
  };

  // Status
  isResolved: boolean;
  resolvedAt?: string;
  errorMessage?: string;

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSectionCreateInput {
  packId: string;
  sectionType: SectionType;
  categoryKey: CategoryKey;
  title: string;
  subtitle?: string;
  order: number;
  mode?: SectionMode;
  dataSource?: SectionDataSource;
  customContent?: string;
  clientVisible?: boolean;
  displayConfig?: ReportSection['displayConfig'];
}

export interface ReportSectionUpdateInput {
  title?: string;
  subtitle?: string;
  order?: number;
  mode?: SectionMode;
  dataSource?: SectionDataSource;
  customContent?: string;
  contentJson?: string;
  clientVisible?: boolean;
  displayConfig?: ReportSection['displayConfig'];
}

export const categoryLabels: Record<CategoryKey, { en: string; ru: string; uk: string }> = {
  net_worth: { en: 'Net Worth', ru: 'Состояние', uk: 'Стан' },
  performance: { en: 'Performance', ru: 'Доходность', uk: 'Дохідність' },
  risk: { en: 'Risk', ru: 'Риски', uk: 'Ризики' },
  liquidity: { en: 'Liquidity', ru: 'Ликвидность', uk: 'Ліквідність' },
  fees: { en: 'Fees', ru: 'Комиссии', uk: 'Комісії' },
  tax: { en: 'Tax', ru: 'Налоги', uk: 'Податки' },
  trusts: { en: 'Trusts', ru: 'Трасты', uk: 'Трасти' },
  ai: { en: 'AI Insights', ru: 'AI Аналитика', uk: 'AI Аналітика' },
  custom: { en: 'Custom', ru: 'Пользовательская', uk: 'Користувацька' },
};

export const sectionTypeLabels: Record<SectionType, { en: string; ru: string; uk: string }> = {
  cover: { en: 'Cover Page', ru: 'Титульная страница', uk: 'Титульна сторінка' },
  toc: { en: 'Table of Contents', ru: 'Содержание', uk: 'Зміст' },
  'executive-summary': { en: 'Executive Summary', ru: 'Резюме', uk: 'Резюме' },
  performance: { en: 'Performance', ru: 'Доходность', uk: 'Дохідність' },
  allocation: { en: 'Allocation', ru: 'Аллокация', uk: 'Алокація' },
  holdings: { en: 'Holdings', ru: 'Позиции', uk: 'Позиції' },
  transactions: { en: 'Transactions', ru: 'Транзакции', uk: 'Транзакції' },
  fees: { en: 'Fees', ru: 'Комиссии', uk: 'Комісії' },
  risk: { en: 'Risk', ru: 'Риски', uk: 'Ризики' },
  compliance: { en: 'Compliance', ru: 'Комплаенс', uk: 'Комплаєнс' },
  'ips-status': { en: 'IPS Status', ru: 'Статус IPS', uk: 'Статус IPS' },
  'tax-summary': { en: 'Tax Summary', ru: 'Налоговая сводка', uk: 'Податкова зведення' },
  liquidity: { en: 'Liquidity', ru: 'Ликвидность', uk: 'Ліквідність' },
  trusts: { en: 'Trusts', ru: 'Трасты', uk: 'Трасти' },
  commentary: { en: 'Commentary', ru: 'Комментарий', uk: 'Коментар' },
  'ai-narrative': { en: 'AI Narrative', ru: 'AI Нарратив', uk: 'AI Наратив' },
  appendix: { en: 'Appendix', ru: 'Приложение', uk: 'Додаток' },
  custom: { en: 'Custom', ru: 'Пользовательская', uk: 'Користувацька' },
};

export const defaultDisclaimers: Record<DisclaimerType, { en: string; ru: string; uk: string }> = {
  tax: {
    en: 'This is not tax advice. Consult a qualified tax professional.',
    ru: 'Не является налоговой консультацией. Обратитесь к квалифицированному налоговому специалисту.',
    uk: 'Не є податковою консультацією. Зверніться до кваліфікованого податкового спеціаліста.',
  },
  legal: {
    en: 'This is not legal advice. Consult a qualified attorney.',
    ru: 'Не является юридической консультацией. Обратитесь к квалифицированному юристу.',
    uk: 'Не є юридичною консультацією. Зверніться до кваліфікованого юриста.',
  },
  ai: {
    en: 'AI-generated content is informational and requires human verification.',
    ru: 'Контент, сгенерированный AI, носит информационный характер и требует проверки человеком.',
    uk: 'Контент, згенерований AI, має інформаційний характер і потребує перевірки людиною.',
  },
  general: {
    en: 'For informational purposes only. Verify all data before making decisions.',
    ru: 'Только для информационных целей. Проверьте все данные перед принятием решений.',
    uk: 'Лише для інформаційних цілей. Перевірте всі дані перед прийняттям рішень.',
  },
};

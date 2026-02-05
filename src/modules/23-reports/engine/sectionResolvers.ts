/**
 * Section Resolvers Engine
 * Resolves data sources for report sections
 */

import {
  ReportSection,
  SectionType,
  DataSourceModule,
  SectionDataSource,
} from '../schema/reportSection';

// Placeholder for resolved section data
export interface ResolvedSectionData {
  sectionId: string;
  sectionType: SectionType;
  title: string;
  subtitle?: string;
  data: unknown;
  metadata: {
    resolvedAt: string;
    dataSource?: DataSourceModule;
    rowCount?: number;
    totalValue?: number;
  };
}

// Generate current timestamp
function now(): string {
  return new Date().toISOString();
}

/**
 * Resolve data for a single section
 */
export async function resolveSection(
  section: ReportSection,
  context: {
    periodStart: string;
    periodEnd: string;
    clientId?: string;
    entityIds?: string[];
    portfolioIds?: string[];
  }
): Promise<ResolvedSectionData> {
  const { dataSource } = section;

  if (!dataSource) {
    // Section without data source (e.g., cover, commentary)
    return {
      sectionId: section.id,
      sectionType: section.sectionType,
      title: section.title,
      subtitle: section.subtitle,
      data: section.customContent || null,
      metadata: {
        resolvedAt: now(),
      },
    };
  }

  // Resolve based on module
  const data = await resolveModuleData(dataSource, context);

  return {
    sectionId: section.id,
    sectionType: section.sectionType,
    title: section.title,
    subtitle: section.subtitle,
    data,
    metadata: {
      resolvedAt: now(),
      dataSource: dataSource.moduleKey,
      rowCount: Array.isArray(data) ? data.length : undefined,
    },
  };
}

/**
 * Resolve data from a specific module
 */
async function resolveModuleData(
  dataSource: SectionDataSource,
  context: {
    periodStart: string;
    periodEnd: string;
    clientId?: string;
    entityIds?: string[];
    portfolioIds?: string[];
  }
): Promise<unknown> {
  const { moduleKey, queryParams } = dataSource;

  // Build query string
  const params = new URLSearchParams();
  params.set('periodStart', context.periodStart);
  params.set('periodEnd', context.periodEnd);

  if (context.clientId) params.set('clientId', context.clientId);
  if (context.entityIds?.length) params.set('entityIds', context.entityIds.join(','));
  if (context.portfolioIds?.length) params.set('portfolioIds', context.portfolioIds.join(','));

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      params.set(key, String(value));
    });
  }

  // Fetch data from module API
  try {
    const response = await fetch(`/api/reports/resolve/${moduleKey}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to resolve data from ${moduleKey}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error resolving ${moduleKey}:`, error);
    throw error;
  }
}

/**
 * Get resolver configuration for a section type
 */
export function getSectionResolverConfig(sectionType: SectionType): {
  requiresData: boolean;
  defaultModule?: DataSourceModule;
  supportedModules: DataSourceModule[];
} {
  const resolverConfigs: Record<SectionType, ReturnType<typeof getSectionResolverConfig>> = {
    'cover': {
      requiresData: false,
      supportedModules: [],
    },
    'toc': {
      requiresData: false,
      supportedModules: [],
    },
    'executive-summary': {
      requiresData: false,
      supportedModules: ['custom'],
    },
    'performance': {
      requiresData: true,
      defaultModule: 'performance',
      supportedModules: ['performance'],
    },
    'allocation': {
      requiresData: true,
      defaultModule: 'net-worth',
      supportedModules: ['net-worth'],
    },
    'holdings': {
      requiresData: true,
      defaultModule: 'net-worth',
      supportedModules: ['net-worth', 'reconciliation'],
    },
    'transactions': {
      requiresData: true,
      defaultModule: 'general-ledger',
      supportedModules: ['general-ledger'],
    },
    'fees': {
      requiresData: true,
      defaultModule: 'fees',
      supportedModules: ['fees'],
    },
    'risk': {
      requiresData: true,
      defaultModule: 'risk',
      supportedModules: ['risk', 'ips'],
    },
    'compliance': {
      requiresData: true,
      defaultModule: 'ips',
      supportedModules: ['ips', 'risk'],
    },
    'ips-status': {
      requiresData: true,
      defaultModule: 'ips',
      supportedModules: ['ips'],
    },
    'tax-summary': {
      requiresData: true,
      defaultModule: 'tax',
      supportedModules: ['tax'],
    },
    'liquidity': {
      requiresData: true,
      defaultModule: 'liquidity',
      supportedModules: ['liquidity'],
    },
    'trusts': {
      requiresData: true,
      defaultModule: 'trusts',
      supportedModules: ['trusts'],
    },
    'commentary': {
      requiresData: false,
      supportedModules: ['custom'],
    },
    'ai-narrative': {
      requiresData: false,
      defaultModule: 'ai',
      supportedModules: ['ai', 'custom'],
    },
    'appendix': {
      requiresData: false,
      supportedModules: ['documents', 'custom'],
    },
    'custom': {
      requiresData: false,
      supportedModules: ['net-worth', 'performance', 'reconciliation', 'general-ledger', 'partnerships', 'private-capital', 'liquidity', 'documents', 'fees', 'workflow', 'ips', 'risk', 'tax', 'trusts', 'integrations', 'custom'],
    },
  };

  return resolverConfigs[sectionType];
}

/**
 * Transform resolved data for display
 */
export function transformSectionData(
  sectionType: SectionType,
  data: unknown,
  transformKey?: string
): unknown {
  if (!data) return null;

  // Apply transform based on section type
  switch (sectionType) {
    case 'performance':
      return transformPerformanceData(data);
    case 'allocation':
      return transformAllocationData(data);
    case 'holdings':
      return transformHoldingsData(data);
    case 'transactions':
      return transformTransactionsData(data);
    default:
      return data;
  }
}

// Transform functions for specific section types
function transformPerformanceData(data: unknown): unknown {
  // Transform performance data for display
  return data;
}

function transformAllocationData(data: unknown): unknown {
  // Transform allocation data for pie chart
  return data;
}

function transformHoldingsData(data: unknown): unknown {
  // Transform holdings data for table
  return data;
}

function transformTransactionsData(data: unknown): unknown {
  // Transform transactions for ledger display
  return data;
}

/**
 * Resolve all sections in a pack
 */
export async function resolveAllSections(
  sections: ReportSection[],
  context: {
    periodStart: string;
    periodEnd: string;
    clientId?: string;
    entityIds?: string[];
    portfolioIds?: string[];
  }
): Promise<Map<string, ResolvedSectionData>> {
  const results = new Map<string, ResolvedSectionData>();

  // Resolve sections in parallel
  const resolvePromises = sections.map(async (section) => {
    try {
      const resolved = await resolveSection(section, context);
      results.set(section.id, resolved);
    } catch (error) {
      results.set(section.id, {
        sectionId: section.id,
        sectionType: section.sectionType,
        title: section.title,
        data: null,
        metadata: {
          resolvedAt: now(),
        },
      });
    }
  });

  await Promise.all(resolvePromises);

  return results;
}

/**
 * Get section type display name
 */
export function getSectionTypeLabel(sectionType: SectionType, locale: 'en' | 'ru' | 'uk' = 'en'): string {
  const labels: Record<SectionType, Record<string, string>> = {
    'cover': { en: 'Cover Page', ru: 'Титульная страница', uk: 'Титульна сторінка' },
    'toc': { en: 'Table of Contents', ru: 'Содержание', uk: 'Зміст' },
    'executive-summary': { en: 'Executive Summary', ru: 'Резюме руководителя', uk: 'Резюме керівника' },
    'performance': { en: 'Performance', ru: 'Эффективность', uk: 'Ефективність' },
    'allocation': { en: 'Asset Allocation', ru: 'Распределение активов', uk: 'Розподіл активів' },
    'holdings': { en: 'Holdings', ru: 'Позиции', uk: 'Позиції' },
    'transactions': { en: 'Transactions', ru: 'Транзакции', uk: 'Транзакції' },
    'fees': { en: 'Fees', ru: 'Комиссии', uk: 'Комісії' },
    'risk': { en: 'Risk Analysis', ru: 'Анализ рисков', uk: 'Аналіз ризиків' },
    'compliance': { en: 'Compliance', ru: 'Комплаенс', uk: 'Комплаєнс' },
    'ips-status': { en: 'IPS Status', ru: 'Статус IPS', uk: 'Статус IPS' },
    'tax-summary': { en: 'Tax Summary', ru: 'Налоговая сводка', uk: 'Податкова зведка' },
    'liquidity': { en: 'Liquidity', ru: 'Ликвидность', uk: 'Ліквідність' },
    'trusts': { en: 'Trusts', ru: 'Трасты', uk: 'Трасти' },
    'commentary': { en: 'Commentary', ru: 'Комментарии', uk: 'Коментарі' },
    'ai-narrative': { en: 'AI Narrative', ru: 'AI Нарратив', uk: 'AI Наратив' },
    'appendix': { en: 'Appendix', ru: 'Приложения', uk: 'Додатки' },
    'custom': { en: 'Custom Section', ru: 'Кастомная секция', uk: 'Кастомна секція' },
  };

  return labels[sectionType]?.[locale] || labels[sectionType]?.en || sectionType;
}

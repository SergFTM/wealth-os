/**
 * Pack Composer Engine
 * Creates and manages report packs from templates or scratch
 */

import {
  ReportPack,
  ReportPackCreateInput,
  PackType,
  PeriodType,
  ScopeType,
} from '../schema/reportPack';
import {
  ReportSection,
  ReportSectionCreateInput,
  SectionType,
  CategoryKey,
} from '../schema/reportSection';
import {
  ReportTemplate,
  TemplateSectionConfig,
} from '../schema/reportTemplate';

// Generate unique IDs
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Derive category from section type
function getCategoryFromSectionType(sectionType: SectionType): CategoryKey {
  const mapping: Record<SectionType, CategoryKey> = {
    'cover': 'custom',
    'toc': 'custom',
    'executive-summary': 'net_worth',
    'performance': 'performance',
    'allocation': 'net_worth',
    'holdings': 'net_worth',
    'transactions': 'net_worth',
    'fees': 'fees',
    'risk': 'risk',
    'compliance': 'risk',
    'ips-status': 'risk',
    'tax-summary': 'tax',
    'liquidity': 'liquidity',
    'trusts': 'trusts',
    'commentary': 'custom',
    'ai-narrative': 'ai',
    'appendix': 'custom',
    'custom': 'custom',
  };
  return mapping[sectionType] || 'custom';
}

// Get current ISO timestamp
function now(): string {
  return new Date().toISOString();
}

/**
 * Create a new report pack from scratch
 */
export function createPack(
  input: ReportPackCreateInput,
  userId: string
): ReportPack {
  const timestamp = now();

  return {
    id: generateId('pack'),
    name: input.name,
    packType: input.packType,
    status: 'draft',
    version: 1,

    periodType: input.periodType,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    periodLabel: input.periodLabel,

    clientId: input.clientId,
    scopeType: input.scopeType || 'global',
    scopeId: input.scopeId,
    entityIds: input.entityIds,
    portfolioIds: input.portfolioIds,

    clientSafe: input.clientSafe ?? false,

    templateId: input.templateId,
    templateVersion: undefined,

    sectionIds: [],

    description: input.description,
    tags: input.tags,

    createdBy: userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Create a report pack from a template
 */
export function createPackFromTemplate(
  template: ReportTemplate,
  periodStart: string,
  periodEnd: string,
  periodLabel: string,
  userId: string,
  options?: {
    name?: string;
    clientId?: string;
    entityIds?: string[];
    portfolioIds?: string[];
    description?: string;
  }
): { pack: ReportPack; sections: ReportSectionCreateInput[] } {
  const timestamp = now();
  const packId = generateId('pack');

  const pack: ReportPack = {
    id: packId,
    name: options?.name || `${template.name} - ${periodLabel}`,
    packType: template.packType,
    status: 'draft',
    version: 1,

    periodType: template.defaultPeriodType,
    periodStart,
    periodEnd,
    periodLabel,

    clientId: options?.clientId,
    scopeType: 'global',
    entityIds: options?.entityIds,
    portfolioIds: options?.portfolioIds,

    clientSafe: false,

    templateId: template.id,
    templateVersion: template.version,

    sectionIds: [],

    description: options?.description || template.description,

    createdBy: userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // Generate sections from template
  const sections: ReportSectionCreateInput[] = template.sections.map((sectionConfig) => ({
    packId,
    sectionType: sectionConfig.sectionType,
    categoryKey: getCategoryFromSectionType(sectionConfig.sectionType),
    title: sectionConfig.title,
    subtitle: sectionConfig.subtitle,
    order: sectionConfig.order,
    dataSource: sectionConfig.dataSource,
    displayConfig: sectionConfig.displayConfig,
  }));

  return { pack, sections };
}

/**
 * Clone an existing pack
 */
export function clonePack(
  originalPack: ReportPack,
  userId: string,
  options?: {
    name?: string;
    periodStart?: string;
    periodEnd?: string;
    periodLabel?: string;
  }
): ReportPack {
  const timestamp = now();

  return {
    ...originalPack,
    id: generateId('pack'),
    name: options?.name || `${originalPack.name} (Copy)`,
    status: 'draft',
    version: 1,

    periodStart: options?.periodStart || originalPack.periodStart,
    periodEnd: options?.periodEnd || originalPack.periodEnd,
    periodLabel: options?.periodLabel || originalPack.periodLabel,

    sectionIds: [], // Sections need to be cloned separately

    previousVersionId: undefined,
    lockedAt: undefined,
    lockedBy: undefined,
    publishedAt: undefined,
    publishedBy: undefined,

    createdBy: userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Create a new version of a locked/published pack
 */
export function createNewVersion(
  originalPack: ReportPack,
  userId: string
): ReportPack {
  const timestamp = now();

  return {
    ...originalPack,
    id: generateId('pack'),
    status: 'draft',
    version: originalPack.version + 1,

    previousVersionId: originalPack.id,
    lockedAt: undefined,
    lockedBy: undefined,
    publishedAt: undefined,
    publishedBy: undefined,

    createdBy: userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Lock a pack for finalization
 */
export function lockPack(
  pack: ReportPack,
  userId: string
): ReportPack {
  if (pack.status !== 'draft') {
    throw new Error(`Cannot lock pack with status: ${pack.status}`);
  }

  const timestamp = now();

  return {
    ...pack,
    status: 'locked',
    lockedAt: timestamp,
    lockedBy: userId,
    updatedAt: timestamp,
  };
}

/**
 * Publish a locked pack
 */
export function publishPack(
  pack: ReportPack,
  userId: string
): ReportPack {
  if (pack.status !== 'locked') {
    throw new Error(`Cannot publish pack with status: ${pack.status}`);
  }

  const timestamp = now();

  return {
    ...pack,
    status: 'published',
    publishedAt: timestamp,
    publishedBy: userId,
    updatedAt: timestamp,
  };
}

/**
 * Archive a pack
 */
export function archivePack(
  pack: ReportPack,
  userId: string
): ReportPack {
  const timestamp = now();

  return {
    ...pack,
    status: 'archived',
    updatedAt: timestamp,
  };
}

/**
 * Calculate period label based on period type and dates
 */
export function calculatePeriodLabel(
  periodType: PeriodType,
  periodStart: string,
  periodEnd: string
): string {
  const startDate = new Date(periodStart);
  const endDate = new Date(periodEnd);

  switch (periodType) {
    case 'monthly':
      return startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'quarterly':
      const quarter = Math.ceil((startDate.getMonth() + 1) / 3);
      return `Q${quarter} ${startDate.getFullYear()}`;
    case 'annual':
      return `FY ${startDate.getFullYear()}`;
    case 'custom':
    default:
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }
}

/**
 * Get default sections for a pack type
 */
export function getDefaultSections(packType: PackType): SectionType[] {
  switch (packType) {
    case 'executive':
      return ['cover', 'executive-summary', 'performance', 'allocation', 'commentary'];
    case 'committee':
      return ['cover', 'toc', 'executive-summary', 'ips-status', 'risk', 'performance', 'appendix'];
    case 'client':
      return ['cover', 'performance', 'allocation', 'holdings', 'transactions', 'fees'];
    case 'compliance':
      return ['cover', 'toc', 'compliance', 'ips-status', 'risk', 'appendix'];
    case 'regulatory':
      return ['cover', 'toc', 'compliance', 'holdings', 'transactions', 'appendix'];
    case 'custom':
    default:
      return ['cover', 'executive-summary'];
  }
}

/**
 * Validate pack before locking
 */
export function validatePackForLock(
  pack: ReportPack,
  sections: ReportSection[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!pack.name?.trim()) {
    errors.push('Pack name is required');
  }

  if (!pack.periodStart || !pack.periodEnd) {
    errors.push('Period dates are required');
  }

  if (sections.length === 0) {
    errors.push('Pack must have at least one section');
  }

  const unresolvedSections = sections.filter(s => !s.isResolved && s.dataSource);
  if (unresolvedSections.length > 0) {
    errors.push(`${unresolvedSections.length} section(s) have unresolved data`);
  }

  const errorSections = sections.filter(s => s.errorMessage);
  if (errorSections.length > 0) {
    errors.push(`${errorSections.length} section(s) have errors`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

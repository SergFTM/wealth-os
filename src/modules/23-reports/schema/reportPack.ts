/**
 * ReportPack Schema
 * Represents a complete report package with multiple sections
 */

export type PackType = 'executive' | 'committee' | 'client' | 'compliance' | 'regulatory' | 'custom';
export type PackStatus = 'draft' | 'locked' | 'published' | 'archived';
export type PeriodType = 'monthly' | 'quarterly' | 'annual' | 'ytd' | 'custom';
export type ScopeType = 'client' | 'household' | 'entity' | 'portfolio' | 'global';

export interface ReportPack {
  id: string;
  name: string;
  packType: PackType;
  status: PackStatus;
  version: number;

  // Period settings
  periodType: PeriodType;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  periodLabel: string; // e.g., "Q4 2024", "January 2025"

  // Scope
  clientId?: string;
  scopeType: ScopeType;
  scopeId?: string;
  entityIds?: string[];
  portfolioIds?: string[];

  // Client Safe
  clientSafe: boolean;

  // Template reference
  templateId?: string;
  templateVersion?: number;

  // Sections (ordered)
  sectionIds: string[];

  // Metadata
  description?: string;
  notes?: string;
  tags?: string[];

  // Versioning
  previousVersionId?: string;
  lockedAt?: string;
  lockedBy?: string;
  publishedAt?: string;
  publishedBy?: string;

  // Audit
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportPackCreateInput {
  name: string;
  packType: PackType;
  periodType: PeriodType;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  clientId?: string;
  scopeType?: ScopeType;
  scopeId?: string;
  entityIds?: string[];
  portfolioIds?: string[];
  clientSafe?: boolean;
  templateId?: string;
  description?: string;
  tags?: string[];
}

export interface ReportPackUpdateInput {
  name?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  periodLabel?: string;
  entityIds?: string[];
  portfolioIds?: string[];
  clientSafe?: boolean;
}

export interface ReportPackFilters {
  packType?: PackType;
  status?: PackStatus;
  clientId?: string;
  scopeType?: ScopeType;
  periodType?: PeriodType;
  clientSafe?: boolean;
  createdBy?: string;
  search?: string;
}

export const packTypeLabels: Record<PackType, { en: string; ru: string; uk: string }> = {
  executive: { en: 'Executive', ru: 'Исполнительный', uk: 'Виконавчий' },
  committee: { en: 'Committee', ru: 'Комитетский', uk: 'Комітетський' },
  client: { en: 'Client', ru: 'Клиентский', uk: 'Клієнтський' },
  compliance: { en: 'Compliance', ru: 'Комплаенс', uk: 'Комплаєнс' },
  regulatory: { en: 'Regulatory', ru: 'Регуляторный', uk: 'Регуляторний' },
  custom: { en: 'Custom', ru: 'Пользовательский', uk: 'Користувацький' },
};

export const packStatusLabels: Record<PackStatus, { en: string; ru: string; uk: string }> = {
  draft: { en: 'Draft', ru: 'Черновик', uk: 'Чернетка' },
  locked: { en: 'Locked', ru: 'Заблокирован', uk: 'Заблоковано' },
  published: { en: 'Published', ru: 'Опубликован', uk: 'Опубліковано' },
  archived: { en: 'Archived', ru: 'Архив', uk: 'Архів' },
};

export const scopeTypeLabels: Record<ScopeType, { en: string; ru: string; uk: string }> = {
  client: { en: 'Client', ru: 'Клиент', uk: 'Клієнт' },
  household: { en: 'Household', ru: 'Домохозяйство', uk: 'Домогосподарство' },
  entity: { en: 'Entity', ru: 'Структура', uk: 'Структура' },
  portfolio: { en: 'Portfolio', ru: 'Портфель', uk: 'Портфель' },
  global: { en: 'Global', ru: 'Глобальный', uk: 'Глобальний' },
};

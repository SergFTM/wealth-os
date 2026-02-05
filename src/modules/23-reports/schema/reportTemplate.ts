/**
 * ReportTemplate Schema
 * Reusable templates for creating report packs
 */

import { PackType, PeriodType } from './reportPack';
import { SectionType, SectionDataSource } from './reportSection';

export interface TemplateSectionConfig {
  sectionType: SectionType;
  title: string;
  subtitle?: string;
  order: number;
  dataSource?: SectionDataSource;
  displayConfig?: {
    showTitle?: boolean;
    showSubtitle?: boolean;
    pageBreakBefore?: boolean;
    pageBreakAfter?: boolean;
    columns?: number;
    chartType?: string;
  };
  isRequired?: boolean;
  helpText?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;

  // Template settings
  packType: PackType;
  defaultPeriodType: PeriodType;

  // Section configurations
  sections: TemplateSectionConfig[];

  // Branding
  headerHtml?: string;
  footerHtml?: string;
  logoUrl?: string;
  primaryColor?: string;

  // Access control
  isGlobal: boolean; // Available to all users
  clientIds?: string[]; // Specific client access
  roleAccess?: string[]; // Roles that can use this template

  // Status
  isActive: boolean;
  version: number;

  // Metadata
  category?: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplateCreateInput {
  name: string;
  description?: string;
  packType: PackType;
  defaultPeriodType: PeriodType;
  sections: TemplateSectionConfig[];
  headerHtml?: string;
  footerHtml?: string;
  logoUrl?: string;
  primaryColor?: string;
  isGlobal?: boolean;
  clientIds?: string[];
  roleAccess?: string[];
  category?: string;
  tags?: string[];
}

export interface ReportTemplateUpdateInput {
  name?: string;
  description?: string;
  defaultPeriodType?: PeriodType;
  sections?: TemplateSectionConfig[];
  headerHtml?: string;
  footerHtml?: string;
  logoUrl?: string;
  primaryColor?: string;
  isGlobal?: boolean;
  clientIds?: string[];
  roleAccess?: string[];
  isActive?: boolean;
  category?: string;
  tags?: string[];
}

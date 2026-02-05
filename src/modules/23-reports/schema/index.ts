/**
 * Reports Module Schema Index
 * Export all schema types for the Reporting Studio module
 */

export * from './reportPack';
export * from './reportSection';
export * from './reportTemplate';
export * from './reportExport';
export * from './reportShare';
export * from './reportLibraryItem';

// Re-export commonly used types
export type {
  PackType,
  PackStatus,
  PeriodType,
  ScopeType,
  ReportPack,
  ReportPackCreateInput,
  ReportPackUpdateInput,
  ReportPackFilters,
} from './reportPack';

export type {
  SectionType,
  CategoryKey,
  SectionMode,
  DataSourceModule,
  SectionDataSource,
  SourceRef,
  DisclaimerType,
  SectionDisclaimer,
  ReportSection,
  ReportSectionCreateInput,
  ReportSectionUpdateInput,
} from './reportSection';

export type {
  TemplateSectionConfig,
  ReportTemplate,
  ReportTemplateCreateInput,
  ReportTemplateUpdateInput,
} from './reportTemplate';

export type {
  ExportFormat,
  ExportStatus,
  ReportExport,
  ReportExportCreateInput,
  ExportManifest,
} from './reportExport';

export type {
  ShareAccessLevel,
  ShareStatus,
  ReportShare,
  ReportShareCreateInput,
  ReportShareUpdateInput,
  ShareAccessCheck,
} from './reportShare';

export type {
  LibraryItemType,
  ChartConfig,
  TableConfig,
  MetricConfig,
  ReportLibraryItem,
  ReportLibraryItemCreateInput,
} from './reportLibraryItem';

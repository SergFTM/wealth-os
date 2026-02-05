/**
 * ReportLibraryItem Schema
 * Reusable content blocks for reports (charts, tables, text blocks)
 */

export type LibraryItemType = 'chart' | 'table' | 'text' | 'metric' | 'image' | 'widget';

export interface ChartConfig {
  chartType: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter' | 'combo';
  dataKeys: string[];
  xAxisKey?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  stacked?: boolean;
}

export interface TableConfig {
  columns: {
    key: string;
    header: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    format?: 'text' | 'number' | 'currency' | 'percent' | 'date';
  }[];
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
}

export interface MetricConfig {
  valueKey: string;
  format: 'number' | 'currency' | 'percent';
  compareKey?: string;
  showTrend?: boolean;
  trendDirection?: 'up-good' | 'down-good';
}

export interface ReportLibraryItem {
  id: string;
  name: string;
  description?: string;

  // Item type and config
  itemType: LibraryItemType;
  chartConfig?: ChartConfig;
  tableConfig?: TableConfig;
  metricConfig?: MetricConfig;

  // Content
  contentJson?: string; // Static content
  customHtml?: string; // Custom HTML/markdown

  // Data source
  dataSourceModule?: string;
  dataSourceQuery?: Record<string, string | number | boolean>;

  // Display
  defaultWidth?: 'full' | 'half' | 'third' | 'quarter';
  defaultHeight?: number; // px

  // Access
  isGlobal: boolean;
  clientIds?: string[];

  // Usage tracking
  usageCount: number;
  lastUsedAt?: string;

  // Metadata
  category?: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportLibraryItemCreateInput {
  name: string;
  description?: string;
  itemType: LibraryItemType;
  chartConfig?: ChartConfig;
  tableConfig?: TableConfig;
  metricConfig?: MetricConfig;
  contentJson?: string;
  customHtml?: string;
  dataSourceModule?: string;
  dataSourceQuery?: Record<string, string | number | boolean>;
  defaultWidth?: ReportLibraryItem['defaultWidth'];
  defaultHeight?: number;
  isGlobal?: boolean;
  clientIds?: string[];
  category?: string;
  tags?: string[];
}

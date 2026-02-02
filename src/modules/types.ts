import { Locale } from '@/lib/i18n';

export interface ModuleKpi {
  key: string;
  title: Record<Locale, string>;
  format?: 'number' | 'currency' | 'percent';
  status?: 'ok' | 'warning' | 'critical' | 'info';
  linkToList?: boolean;
}

export interface ModuleColumn {
  key: string;
  header: Record<Locale, string>;
  width?: string;
  type?: 'text' | 'date' | 'currency' | 'status' | 'badge';
}

export interface ModuleAction {
  key: string;
  label: Record<Locale, string>;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface ModuleConfig {
  id: string;
  slug: string;
  order: number;
  icon: string;
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  kpis: ModuleKpi[];
  columns: ModuleColumn[];
  actions: ModuleAction[];
  disclaimer?: Record<Locale, string>;
  adminOnly?: boolean;
  clientSafeHidden?: boolean;
}

export interface ModuleDataItem {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ModuleMock {
  kpiValues: Record<string, number | string>;
  items: ModuleDataItem[];
}

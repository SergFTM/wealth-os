
export interface ModuleKpi {
  key: string;
  title: Record<string, string>;
  format?: 'number' | 'currency' | 'percent';
  status?: 'ok' | 'warning' | 'critical' | 'info';
  linkToList?: boolean;
}

export interface ModuleColumn {
  key: string;
  header: Record<string, string>;
  width?: string;
  type?: 'text' | 'date' | 'currency' | 'status' | 'badge';
}

export interface ModuleAction {
  key: string;
  label: Record<string, string>;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface ModuleTab {
  key: string;
  label: Record<string, string>;
}

export interface ModuleConfig {
  id: string;
  slug: string;
  order: number;
  icon: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  kpis?: ModuleKpi[];
  columns?: ModuleColumn[];
  actions?: ModuleAction[];
  disclaimer?: Record<string, string>;
  adminOnly?: boolean;
  clientSafeHidden?: boolean;
  // Extended properties for comprehensive modules
  color?: string;
  enabled?: boolean;
  collections?: string[];
  routes?: Record<string, string>;
  tabs?: ModuleTab[];
}

export interface ModuleDataItem {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ModuleMock {
  kpiValues: Record<string, number | string>;
  items: ModuleDataItem[];
}

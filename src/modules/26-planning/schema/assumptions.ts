/**
 * Planning Assumptions Schema
 * Return, inflation, and other assumptions for projections
 */

export type SourceType = 'manual' | 'demo_market' | 'imported';

export interface FxRate {
  from: string;
  to: string;
  rate: number;
}

export interface SourceRef {
  name: string;
  url?: string;
  asOf: string;
}

export interface Assumptions {
  id: string;
  clientId?: string;
  householdId?: string;
  scopeType?: 'global' | 'household' | 'entity';
  scopeId?: string;
  name?: string;
  inflationPct: number;
  returnPct: number;
  returnByAssetClass?: Record<string, number>;
  fxRates: Record<string, number>;
  feeDragPct: number;
  taxDragPct?: number;
  horizonYears: number;
  sourceType?: SourceType;
  sourceRefs?: SourceRef[];
  asOf?: string;
  locked?: boolean;
  notes?: string;
  updatedAt: string;
}

// Alias for backwards compatibility
export type PlanningAssumptions = Assumptions;

export interface AssumptionsCreateInput {
  clientId?: string;
  scopeType?: Assumptions['scopeType'];
  scopeId?: string;
  name?: string;
  inflationPct: number;
  returnPct: number;
  returnByAssetClass?: Record<string, number>;
  fxRates?: FxRate[];
  feeDragPct?: number;
  taxDragPct?: number;
  sourceType?: SourceType;
  sourceRefs?: SourceRef[];
  asOf?: string;
  locked?: boolean;
  notes?: string;
}

export const sourceTypeLabels: Record<SourceType, { en: string; ru: string; uk: string }> = {
  manual: { en: 'Manual Entry', ru: 'Ручной ввод', uk: 'Ручне введення' },
  demo_market: { en: 'Demo Market Data', ru: 'Демо рыночные данные', uk: 'Демо ринкові дані' },
  imported: { en: 'Imported', ru: 'Импортировано', uk: 'Імпортовано' },
};

export const DEFAULT_ASSUMPTIONS = {
  inflationPct: 3.0,
  returnPct: 6.0,
  feeDragPct: 0.5,
  taxDragPct: 1.0,
  horizonYears: 20,
  fxRates: {
    EUR: 1.08,
    GBP: 1.27,
    RUB: 0.011,
  },
  sourceType: 'manual' as SourceType,
  locked: false,
};

export const ASSET_CLASS_RETURNS: Record<string, number> = {
  'equity_us': 7.0,
  'equity_intl': 6.5,
  'equity_em': 8.0,
  'fixed_income': 4.0,
  'real_estate': 5.5,
  'alternatives': 6.0,
  'cash': 2.0,
};

export function isAssumptionsStale(dateStr: string, thresholdDays: number = 30): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > thresholdDays;
}

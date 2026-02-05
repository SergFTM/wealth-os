/**
 * Planning Run Schema
 * Computed projections from scenario runs
 */

export interface YearlyProjection {
  year: number;
  netWorth: number;
  liquidAssets: number;
  investedAssets: number;
  netCashflow: number;
  cumulativeCashflow: number;
}

export interface CashflowSummary {
  totalInflows: number;
  totalOutflows: number;
  netCashflow: number;
  byCategory: Record<string, number>;
}

export interface RunMetrics {
  terminalNetWorth: number;
  minLiquidityYear: number;
  minLiquidityAmount: number;
  breakEvenYear?: number;
  averageAnnualReturn: number;
  totalInflowsProjected: number;
  totalOutflowsProjected: number;
}

export interface SourceUsed {
  name: string;
  type: string;
  asOf: string;
}

import { ScenarioType } from './scenario';

export interface PlanningRun {
  id: string;
  clientId?: string;
  scenarioId: string;
  scenarioType?: ScenarioType;
  runAt: string;
  asOf: string;
  startingNetWorth: number;
  horizonYears: number;
  projections: YearlyProjection[];
  cashflowSummary: CashflowSummary;
  metrics: RunMetrics;
  sourcesUsed: SourceUsed[];
  assumptionsSnapshot: {
    inflationPct: number;
    returnPct: number;
    feeDragPct: number;
  };
  confidencePct: number;
  notes?: string;
  createdAt: string;
}

export interface PlanningRunCreateInput {
  clientId?: string;
  scenarioId: string;
  asOf?: string;
  startingNetWorth: number;
  horizonYears: number;
  projections: YearlyProjection[];
  cashflowSummary: CashflowSummary;
  metrics: RunMetrics;
  sourcesUsed?: SourceUsed[];
  assumptionsSnapshot: PlanningRun['assumptionsSnapshot'];
  confidencePct?: number;
  notes?: string;
}

export function formatProjectionCurrency(value: number): string {
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `$${(value / 1e3).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function getConfidenceLabel(pct: number): { en: string; ru: string; uk: string } {
  if (pct >= 80) return { en: 'High', ru: 'Высокая', uk: 'Висока' };
  if (pct >= 60) return { en: 'Medium', ru: 'Средняя', uk: 'Середня' };
  if (pct >= 40) return { en: 'Low', ru: 'Низкая', uk: 'Низька' };
  return { en: 'Very Low', ru: 'Очень низкая', uk: 'Дуже низька' };
}

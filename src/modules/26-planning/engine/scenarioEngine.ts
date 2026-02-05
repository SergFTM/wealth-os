/**
 * Scenario Engine
 * Applies scenario modifiers and runs comparisons
 */

import { Scenario, ScenarioType, SCENARIO_MODIFIERS } from '../schema/scenario';
import { Assumptions, DEFAULT_ASSUMPTIONS } from '../schema/assumptions';
import { CashflowItem } from '../schema/cashflowItem';
import { PlanningRun, YearlyProjection } from '../schema/planningRun';
import { expandCashflowItems } from './cashflowEngine';
import { runProjection, ProjectionInput } from './projectionEngine';

export interface ScenarioInput {
  scenario: Scenario;
  assumptions: Assumptions | null;
  cashflowItems: CashflowItem[];
  startingNetWorth: number;
  liquidRatio: number; // Portion that is liquid (0-1)
}

export interface ScenarioRunResult {
  run: Omit<PlanningRun, 'id' | 'createdAt'>;
  warnings: string[];
}

export function runScenario(input: ScenarioInput): ScenarioRunResult {
  const { scenario, assumptions, cashflowItems, startingNetWorth, liquidRatio } = input;
  const warnings: string[] = [];

  // Get base assumptions or defaults
  const baseInflation = assumptions?.inflationPct ?? DEFAULT_ASSUMPTIONS.inflationPct!;
  const baseReturn = assumptions?.returnPct ?? DEFAULT_ASSUMPTIONS.returnPct!;
  const baseFee = assumptions?.feeDragPct ?? DEFAULT_ASSUMPTIONS.feeDragPct!;

  // Apply scenario modifiers
  const scenarioType = scenario.type || scenario.scenarioType || 'base';
  const modifiers = SCENARIO_MODIFIERS[scenarioType];
  const effectiveReturn = baseReturn + modifiers.returnMod;
  const effectiveInflation = baseInflation + modifiers.inflationMod;

  // Check for missing data
  if (!assumptions) {
    warnings.push('Using default assumptions - no custom assumptions provided');
  }
  if (cashflowItems.length === 0) {
    warnings.push('No cashflow items - projection based on investment returns only');
  }

  // Expand cashflows
  const currentYear = new Date().getFullYear();
  const horizonYears = scenario.horizonYears ?? 20;
  const cashflowProjection = expandCashflowItems(
    cashflowItems,
    currentYear,
    horizonYears,
    effectiveInflation
  );

  // Apply stress shock if applicable
  if (modifiers.shockYear1 !== 0 && cashflowProjection.yearly.length > 0) {
    const shockAmount = startingNetWorth * Math.abs(modifiers.shockYear1);
    cashflowProjection.yearly[0].outflows += shockAmount;
    cashflowProjection.yearly[0].netCashflow -= shockAmount;
    warnings.push(`Stress scenario: ${Math.round(Math.abs(modifiers.shockYear1) * 100)}% shock applied to Year 1`);
  }

  // Run projection
  const projectionInput: ProjectionInput = {
    startingNetWorth,
    startingLiquid: startingNetWorth * liquidRatio,
    startingInvested: startingNetWorth * (1 - liquidRatio),
    horizonYears,
    assumptions: {
      inflationPct: effectiveInflation,
      returnPct: effectiveReturn,
      feeDragPct: baseFee,
    },
    yearlyCashflows: cashflowProjection.yearly,
  };

  const result = runProjection(projectionInput);

  // Calculate confidence based on data quality
  let confidence = 100;
  if (!assumptions) confidence -= 20;
  if (cashflowItems.length < 5) confidence -= 15;
  if (assumptions && !assumptions.sourceRefs?.length) confidence -= 10;
  confidence = Math.max(confidence, 30);

  const now = new Date().toISOString();

  return {
    run: {
      clientId: scenario.clientId,
      scenarioId: scenario.id,
      runAt: now,
      asOf: assumptions?.asOf || now,
      startingNetWorth,
      horizonYears,
      projections: result.projections,
      cashflowSummary: result.cashflowSummary,
      metrics: result.metrics,
      sourcesUsed: assumptions?.sourceRefs?.map(s => ({
        name: s.name,
        type: assumptions.sourceType || 'manual',
        asOf: s.asOf,
      })) || [],
      assumptionsSnapshot: {
        inflationPct: effectiveInflation,
        returnPct: effectiveReturn,
        feeDragPct: baseFee,
      },
      confidencePct: confidence,
    },
    warnings,
  };
}

export interface ScenarioComparison {
  years: number[];
  scenarios: {
    id: string;
    name: string;
    type: ScenarioType;
    projections: YearlyProjection[];
    terminalNetWorth: number;
    averageReturn: number;
  }[];
  maxDifference: number;
  maxDifferenceYear: number;
}

export function compareScenarios(
  runs: PlanningRun[],
  scenarios: Scenario[]
): ScenarioComparison {
  if (runs.length < 2) {
    throw new Error('Need at least 2 runs to compare');
  }

  // Find common year range
  const allYears = new Set<number>();
  runs.forEach(run => {
    run.projections.forEach(p => allYears.add(p.year));
  });
  const years = Array.from(allYears).sort();

  const scenarioData = runs.map(run => {
    const scenario = scenarios.find(s => s.id === run.scenarioId);
    return {
      id: run.scenarioId,
      name: scenario?.name || 'Unknown',
      type: scenario?.scenarioType || 'custom',
      projections: run.projections,
      terminalNetWorth: run.metrics.terminalNetWorth,
      averageReturn: run.metrics.averageAnnualReturn,
    };
  });

  // Calculate max difference
  let maxDifference = 0;
  let maxDifferenceYear = years[0];

  years.forEach(year => {
    const values = scenarioData
      .map(s => s.projections.find(p => p.year === year)?.netWorth || 0)
      .filter(v => v > 0);

    if (values.length >= 2) {
      const diff = Math.max(...values) - Math.min(...values);
      if (diff > maxDifference) {
        maxDifference = diff;
        maxDifferenceYear = year;
      }
    }
  });

  return {
    years,
    scenarios: scenarioData,
    maxDifference,
    maxDifferenceYear,
  };
}

export function getScenarioSummary(
  run: PlanningRun
): {
  status: 'positive' | 'neutral' | 'negative';
  headline: { en: string; ru: string; uk: string };
} {
  const growth = run.metrics.terminalNetWorth / run.startingNetWorth;
  const hasLiquidityRisk = run.metrics.minLiquidityAmount < 0;

  if (hasLiquidityRisk) {
    return {
      status: 'negative',
      headline: {
        en: 'Liquidity shortfall projected',
        ru: 'Прогнозируется дефицит ликвидности',
        uk: 'Прогнозується дефіцит ліквідності',
      },
    };
  }

  if (growth >= 1.5) {
    return {
      status: 'positive',
      headline: {
        en: 'Strong growth trajectory',
        ru: 'Сильная траектория роста',
        uk: 'Сильна траєкторія зростання',
      },
    };
  }

  if (growth >= 1.0) {
    return {
      status: 'neutral',
      headline: {
        en: 'Moderate growth expected',
        ru: 'Ожидается умеренный рост',
        uk: 'Очікується помірне зростання',
      },
    };
  }

  return {
    status: 'negative',
    headline: {
      en: 'Capital preservation at risk',
      ru: 'Риск для сохранения капитала',
      uk: 'Ризик для збереження капіталу',
    },
  };
}

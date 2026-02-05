/**
 * Stress Test Engine
 * Runs stress scenarios on cash forecasts
 */

import { CashStressTest, CashForecast, CashScenario } from './types';
import { buildForecast, ForecastResult, ForecastParams } from './forecastEngine';
import { ScenarioAdjustments } from './scenarioEngine';

export type StressType =
  | 'market_drawdown'
  | 'delayed_distributions'
  | 'tax_spike'
  | 'debt_rate_shock'
  | 'capital_call_acceleration';

export type StressSeverity = 'mild' | 'moderate' | 'severe';

export interface StressParams {
  severity: StressSeverity;
  drawdownPercent?: number;
  delayDays?: number;
  rateShockBps?: number;
  taxIncreasePercent?: number;
  accelerationDays?: number;
}

export interface StressResult {
  minCashReached: number;
  minCashDate: string;
  breachesCount: number;
  breachDays: string[];
  totalShortfall: number;
  impactSummary: string;
  alertsGenerated: number;
  comparisonToBase: {
    minBalanceDiff: number;
    deficitDaysDiff: number;
    variancePercent: number;
  };
}

/**
 * Default stress parameters by severity
 */
const STRESS_DEFAULTS: Record<StressType, Record<StressSeverity, StressParams>> = {
  market_drawdown: {
    mild: { severity: 'mild', drawdownPercent: 10 },
    moderate: { severity: 'moderate', drawdownPercent: 25 },
    severe: { severity: 'severe', drawdownPercent: 50 },
  },
  delayed_distributions: {
    mild: { severity: 'mild', delayDays: 30 },
    moderate: { severity: 'moderate', delayDays: 60 },
    severe: { severity: 'severe', delayDays: 120 },
  },
  tax_spike: {
    mild: { severity: 'mild', taxIncreasePercent: 20 },
    moderate: { severity: 'moderate', taxIncreasePercent: 50 },
    severe: { severity: 'severe', taxIncreasePercent: 100 },
  },
  debt_rate_shock: {
    mild: { severity: 'mild', rateShockBps: 100 },
    moderate: { severity: 'moderate', rateShockBps: 200 },
    severe: { severity: 'severe', rateShockBps: 400 },
  },
  capital_call_acceleration: {
    mild: { severity: 'mild', accelerationDays: 14 },
    moderate: { severity: 'moderate', accelerationDays: 30 },
    severe: { severity: 'severe', accelerationDays: 60 },
  },
};

/**
 * Get default stress params for a type and severity
 */
export function getDefaultStressParams(
  type: StressType,
  severity: StressSeverity
): StressParams {
  return STRESS_DEFAULTS[type][severity];
}

/**
 * Convert stress type and params to scenario adjustments
 */
function stressToAdjustments(
  type: StressType,
  params: StressParams
): ScenarioAdjustments {
  switch (type) {
    case 'market_drawdown':
      return {
        inflowHaircut: params.drawdownPercent || 25,
      };
    case 'delayed_distributions':
      return {
        distributionDelayDays: params.delayDays || 60,
      };
    case 'tax_spike':
      // Increase tax outflows
      return {
        outflowIncrease: params.taxIncreasePercent || 50,
      };
    case 'debt_rate_shock':
      return {
        interestRateShock: params.rateShockBps || 200,
      };
    case 'capital_call_acceleration':
      return {
        capitalCallShiftDays: params.accelerationDays || 30,
      };
    default:
      return {};
  }
}

/**
 * Run a stress test on a forecast
 */
export function runStressTest(
  baseForecastResult: ForecastResult,
  forecastParams: Omit<ForecastParams, 'scenario'>,
  stressType: StressType,
  stressParams: StressParams,
  baseScenario: CashScenario | null
): StressResult {
  // Create stressed scenario
  const stressAdjustments = stressToAdjustments(stressType, stressParams);
  const stressedScenario: CashScenario = {
    id: 'stress-temp',
    clientId: 'temp',
    name: `Stress: ${stressType}`,
    scenarioType: 'custom',
    adjustmentsJson: {
      ...(baseScenario?.adjustmentsJson || {}),
      ...stressAdjustments,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Run stressed forecast
  const stressedResult = buildForecast({
    ...forecastParams,
    scenario: stressedScenario,
  });

  // Calculate shortfall
  const shortfall = forecastParams.minCashThreshold - stressedResult.minBalance;
  const totalShortfall = shortfall > 0 ? shortfall : 0;

  // Count breach days
  const breachDays = stressedResult.deficitDates;

  // Generate impact summary
  const impactSummary = generateImpactSummary(
    stressType,
    stressParams,
    baseForecastResult,
    stressedResult
  );

  // Calculate comparison to base
  const minBalanceDiff = stressedResult.minBalance - baseForecastResult.minBalance;
  const deficitDaysDiff = stressedResult.deficitDays - baseForecastResult.deficitDays;
  const variancePercent =
    baseForecastResult.minBalance !== 0
      ? Math.abs(minBalanceDiff / baseForecastResult.minBalance) * 100
      : 0;

  // Determine alerts needed
  const alertsGenerated = breachDays.length > 0 ? 1 : 0;

  return {
    minCashReached: stressedResult.minBalance,
    minCashDate: stressedResult.minBalanceDate,
    breachesCount: breachDays.length,
    breachDays,
    totalShortfall,
    impactSummary,
    alertsGenerated,
    comparisonToBase: {
      minBalanceDiff,
      deficitDaysDiff,
      variancePercent,
    },
  };
}

/**
 * Generate human-readable impact summary
 */
function generateImpactSummary(
  type: StressType,
  params: StressParams,
  base: ForecastResult,
  stressed: ForecastResult
): string {
  const minDiff = stressed.minBalance - base.minBalance;
  const deficitDiff = stressed.deficitDays - base.deficitDays;

  const typeNames: Record<StressType, string> = {
    market_drawdown: 'Рыночный спад',
    delayed_distributions: 'Задержка дистрибуций',
    tax_spike: 'Скачок налогов',
    debt_rate_shock: 'Шок ставок',
    capital_call_acceleration: 'Ускорение capital calls',
  };

  let summary = `${typeNames[type]} (${params.severity}): `;

  if (minDiff < 0) {
    summary += `минимальный баланс снижается на ${formatCurrency(Math.abs(minDiff))}`;
  } else {
    summary += `минимальный баланс без изменений`;
  }

  if (deficitDiff > 0) {
    summary += `, появляется ${deficitDiff} дн. дефицита`;
  }

  if (stressed.deficitDays > 0 && base.deficitDays === 0) {
    summary += `. ВНИМАНИЕ: сценарий создаёт дефицит ликвидности!`;
  }

  return summary;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get stress type display name
 */
export function getStressTypeName(type: StressType, lang: 'ru' | 'en' | 'uk' = 'ru'): string {
  const names: Record<StressType, Record<string, string>> = {
    market_drawdown: { ru: 'Рыночный спад', en: 'Market Drawdown', uk: 'Ринковий спад' },
    delayed_distributions: { ru: 'Задержка дистрибуций', en: 'Delayed Distributions', uk: 'Затримка дистрибуцій' },
    tax_spike: { ru: 'Скачок налогов', en: 'Tax Spike', uk: 'Стрибок податків' },
    debt_rate_shock: { ru: 'Шок ставок', en: 'Rate Shock', uk: 'Шок ставок' },
    capital_call_acceleration: { ru: 'Ускорение capital calls', en: 'Capital Call Acceleration', uk: 'Прискорення capital calls' },
  };
  return names[type][lang] || names[type].en;
}

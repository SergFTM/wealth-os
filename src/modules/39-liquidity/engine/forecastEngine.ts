/**
 * Forecast Engine
 * Builds daily cash flow timeline and computes projected balances
 */

import { CashPosition, CashFlow, CashForecast, CashScenario } from './types';

export interface DailyBalance {
  date: string;
  openingBalance: number;
  inflows: number;
  outflows: number;
  closingBalance: number;
  inflowDetails: Array<{ id: string; amount: number; category: string }>;
  outflowDetails: Array<{ id: string; amount: number; category: string }>;
}

export interface ForecastResult {
  dailyBalances: DailyBalance[];
  minBalance: number;
  minBalanceDate: string;
  maxBalance: number;
  totalInflows: number;
  totalOutflows: number;
  deficitDays: number;
  deficitDates: string[];
  computedAt: string;
}

export interface ForecastParams {
  positions: CashPosition[];
  flows: CashFlow[];
  scenario: CashScenario | null;
  horizonDays: number;
  minCashThreshold: number;
  startDate?: Date;
}

/**
 * Expand recurring flows into individual instances
 */
function expandRecurringFlows(flows: CashFlow[], startDate: Date, endDate: Date): CashFlow[] {
  const expanded: CashFlow[] = [];

  for (const flow of flows) {
    if (!flow.recurrenceJson || flow.recurrenceJson.pattern === 'once') {
      // Single flow
      const flowDate = new Date(flow.flowDate);
      if (flowDate >= startDate && flowDate <= endDate) {
        expanded.push(flow);
      }
    } else {
      // Recurring flow - expand instances
      const pattern = flow.recurrenceJson.pattern;
      const recEndDate = flow.recurrenceJson.endDate
        ? new Date(flow.recurrenceJson.endDate)
        : endDate;
      const maxOccurrences = flow.recurrenceJson.occurrences || 999;

      let currentDate = new Date(flow.flowDate);
      let count = 0;

      while (currentDate <= endDate && currentDate <= recEndDate && count < maxOccurrences) {
        if (currentDate >= startDate) {
          expanded.push({
            ...flow,
            id: `${flow.id}_${count}`,
            flowDate: currentDate.toISOString().split('T')[0],
          });
        }

        // Advance to next occurrence
        count++;
        switch (pattern) {
          case 'weekly':
            currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'biweekly':
            currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
            break;
          case 'monthly':
            currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
            break;
          case 'quarterly':
            currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 3));
            break;
          case 'annually':
            currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
            break;
        }
      }
    }
  }

  return expanded;
}

/**
 * Apply scenario adjustments to flows
 */
function applyScenarioAdjustments(
  flows: CashFlow[],
  scenario: CashScenario | null
): CashFlow[] {
  if (!scenario || !scenario.adjustmentsJson) {
    return flows;
  }

  const adj = scenario.adjustmentsJson;

  return flows.map((flow) => {
    let adjustedAmount = flow.amount;

    if (flow.flowType === 'inflow') {
      // Apply inflow haircut
      if (adj.inflowHaircut) {
        adjustedAmount = adjustedAmount * (1 - adj.inflowHaircut / 100);
      }

      // Delay distributions
      if (adj.distributionDelayDays && flow.categoryKey === 'distribution') {
        const newDate = new Date(flow.flowDate);
        newDate.setDate(newDate.getDate() + adj.distributionDelayDays);
        return { ...flow, amount: adjustedAmount, flowDate: newDate.toISOString().split('T')[0] };
      }
    }

    if (flow.flowType === 'outflow') {
      // Apply outflow increase
      if (adj.outflowIncrease) {
        adjustedAmount = adjustedAmount * (1 + adj.outflowIncrease / 100);
      }

      // Shift capital calls earlier
      if (adj.capitalCallShiftDays && flow.categoryKey === 'capital_call') {
        const newDate = new Date(flow.flowDate);
        newDate.setDate(newDate.getDate() - adj.capitalCallShiftDays);
        return { ...flow, amount: adjustedAmount, flowDate: newDate.toISOString().split('T')[0] };
      }

      // Apply interest rate shock to debt payments
      if (adj.interestRateShock && flow.categoryKey === 'debt') {
        const shockMultiplier = 1 + (adj.interestRateShock / 10000);
        adjustedAmount = adjustedAmount * shockMultiplier;
      }
    }

    return { ...flow, amount: adjustedAmount };
  });
}

/**
 * Build forecast from positions and flows
 */
export function buildForecast(params: ForecastParams): ForecastResult {
  const {
    positions,
    flows,
    scenario,
    horizonDays,
    minCashThreshold,
    startDate = new Date(),
  } = params;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + horizonDays);

  // Calculate starting balance from positions
  const startingBalance = positions.reduce((sum, pos) => sum + pos.balance, 0);

  // Expand recurring flows
  const expandedFlows = expandRecurringFlows(flows, startDate, endDate);

  // Apply scenario adjustments
  const adjustedFlows = applyScenarioAdjustments(expandedFlows, scenario);

  // Group flows by date
  const flowsByDate = new Map<string, CashFlow[]>();
  for (const flow of adjustedFlows) {
    const dateKey = flow.flowDate;
    if (!flowsByDate.has(dateKey)) {
      flowsByDate.set(dateKey, []);
    }
    flowsByDate.get(dateKey)!.push(flow);
  }

  // Build daily timeline
  const dailyBalances: DailyBalance[] = [];
  let currentBalance = startingBalance;
  let minBalance = startingBalance;
  let minBalanceDate = startDate.toISOString().split('T')[0];
  let maxBalance = startingBalance;
  let totalInflows = 0;
  let totalOutflows = 0;
  const deficitDates: string[] = [];

  const currentDay = new Date(startDate);
  while (currentDay <= endDate) {
    const dateKey = currentDay.toISOString().split('T')[0];
    const dayFlows = flowsByDate.get(dateKey) || [];

    const inflows = dayFlows
      .filter((f) => f.flowType === 'inflow')
      .reduce((sum, f) => sum + f.amount, 0);
    const outflows = dayFlows
      .filter((f) => f.flowType === 'outflow')
      .reduce((sum, f) => sum + f.amount, 0);

    const openingBalance = currentBalance;
    const closingBalance = openingBalance + inflows - outflows;

    dailyBalances.push({
      date: dateKey,
      openingBalance,
      inflows,
      outflows,
      closingBalance,
      inflowDetails: dayFlows
        .filter((f) => f.flowType === 'inflow')
        .map((f) => ({ id: f.id, amount: f.amount, category: f.categoryKey })),
      outflowDetails: dayFlows
        .filter((f) => f.flowType === 'outflow')
        .map((f) => ({ id: f.id, amount: f.amount, category: f.categoryKey })),
    });

    currentBalance = closingBalance;
    totalInflows += inflows;
    totalOutflows += outflows;

    if (closingBalance < minBalance) {
      minBalance = closingBalance;
      minBalanceDate = dateKey;
    }
    if (closingBalance > maxBalance) {
      maxBalance = closingBalance;
    }
    if (closingBalance < minCashThreshold) {
      deficitDates.push(dateKey);
    }

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return {
    dailyBalances,
    minBalance,
    minBalanceDate,
    maxBalance,
    totalInflows,
    totalOutflows,
    deficitDays: deficitDates.length,
    deficitDates,
    computedAt: new Date().toISOString(),
  };
}

/**
 * Compare two forecast results
 */
export function compareForecastResults(
  base: ForecastResult,
  comparison: ForecastResult
): {
  minBalanceDiff: number;
  totalInflowsDiff: number;
  totalOutflowsDiff: number;
  deficitDaysDiff: number;
  variancePercent: number;
} {
  const minBalanceDiff = comparison.minBalance - base.minBalance;
  const totalInflowsDiff = comparison.totalInflows - base.totalInflows;
  const totalOutflowsDiff = comparison.totalOutflows - base.totalOutflows;
  const deficitDaysDiff = comparison.deficitDays - base.deficitDays;
  const variancePercent =
    base.minBalance !== 0
      ? Math.abs(minBalanceDiff / base.minBalance) * 100
      : 0;

  return {
    minBalanceDiff,
    totalInflowsDiff,
    totalOutflowsDiff,
    deficitDaysDiff,
    variancePercent,
  };
}

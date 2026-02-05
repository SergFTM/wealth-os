/**
 * Projection Engine
 * Calculates net worth projections over time
 */

import { YearlyProjection, RunMetrics, CashflowSummary } from '../schema/planningRun';
import { Assumptions } from '../schema/assumptions';
import { YearlyCashflow } from './cashflowEngine';

export interface ProjectionInput {
  startingNetWorth: number;
  startingLiquid: number;
  startingInvested: number;
  horizonYears: number;
  assumptions: {
    inflationPct: number;
    returnPct: number;
    feeDragPct: number;
  };
  yearlyCashflows: YearlyCashflow[];
}

export interface ProjectionOutput {
  projections: YearlyProjection[];
  metrics: RunMetrics;
  cashflowSummary: CashflowSummary;
}

export function runProjection(input: ProjectionInput): ProjectionOutput {
  const { startingNetWorth, startingLiquid, startingInvested, horizonYears, assumptions, yearlyCashflows } = input;
  const projections: YearlyProjection[] = [];

  let currentNetWorth = startingNetWorth;
  let currentLiquid = startingLiquid;
  let currentInvested = startingInvested;
  let cumulativeCashflow = 0;

  let minLiquidityYear = 0;
  let minLiquidityAmount = startingLiquid;
  let totalInflowsProjected = 0;
  let totalOutflowsProjected = 0;

  const netReturn = (assumptions.returnPct - assumptions.feeDragPct) / 100;

  for (let i = 0; i < horizonYears; i++) {
    const cashflow = yearlyCashflows[i] || { inflows: 0, outflows: 0, netCashflow: 0, byCategory: {} };
    const netCashflowForYear = cashflow.netCashflow;

    // Track totals
    totalInflowsProjected += cashflow.inflows;
    totalOutflowsProjected += cashflow.outflows;
    cumulativeCashflow += netCashflowForYear;

    // Apply investment return to invested assets
    const investmentGain = currentInvested * netReturn;
    currentInvested += investmentGain;

    // Apply cashflow (negative flows first reduce liquid, then invested if needed)
    if (netCashflowForYear >= 0) {
      currentLiquid += netCashflowForYear;
    } else {
      const outflow = Math.abs(netCashflowForYear);
      if (currentLiquid >= outflow) {
        currentLiquid -= outflow;
      } else {
        const remainder = outflow - currentLiquid;
        currentLiquid = 0;
        currentInvested -= remainder;
      }
    }

    // Update net worth
    currentNetWorth = currentLiquid + currentInvested;

    // Track minimum liquidity
    if (currentLiquid < minLiquidityAmount) {
      minLiquidityAmount = currentLiquid;
      minLiquidityYear = i + 1;
    }

    projections.push({
      year: new Date().getFullYear() + i,
      netWorth: Math.round(currentNetWorth),
      liquidAssets: Math.round(currentLiquid),
      investedAssets: Math.round(currentInvested),
      netCashflow: Math.round(netCashflowForYear),
      cumulativeCashflow: Math.round(cumulativeCashflow),
    });
  }

  // Calculate average annual return
  const totalGrowth = currentNetWorth / startingNetWorth;
  const averageAnnualReturn = (Math.pow(totalGrowth, 1 / horizonYears) - 1) * 100;

  const metrics: RunMetrics = {
    terminalNetWorth: Math.round(currentNetWorth),
    minLiquidityYear,
    minLiquidityAmount: Math.round(minLiquidityAmount),
    averageAnnualReturn: Math.round(averageAnnualReturn * 10) / 10,
    totalInflowsProjected: Math.round(totalInflowsProjected),
    totalOutflowsProjected: Math.round(totalOutflowsProjected),
  };

  // Build category summary from all years
  const categorySummary: Record<string, number> = {};
  yearlyCashflows.forEach(y => {
    Object.entries(y.byCategory).forEach(([cat, amount]) => {
      if (!categorySummary[cat]) categorySummary[cat] = 0;
      categorySummary[cat] += amount;
    });
  });

  const cashflowSummary: CashflowSummary = {
    totalInflows: Math.round(totalInflowsProjected),
    totalOutflows: Math.round(totalOutflowsProjected),
    netCashflow: Math.round(totalInflowsProjected - totalOutflowsProjected),
    byCategory: categorySummary,
  };

  return { projections, metrics, cashflowSummary };
}

export function interpolateProjection(
  projections: YearlyProjection[],
  targetYear: number
): YearlyProjection | null {
  if (projections.length === 0) return null;

  const found = projections.find(p => p.year === targetYear);
  if (found) return found;

  // Return closest year
  const closest = projections.reduce((prev, curr) =>
    Math.abs(curr.year - targetYear) < Math.abs(prev.year - targetYear) ? curr : prev
  );
  return closest;
}

export function calculateRequiredSavings(
  targetAmount: number,
  currentAmount: number,
  yearsToGoal: number,
  expectedReturn: number
): number {
  if (yearsToGoal <= 0) return targetAmount - currentAmount;

  const r = expectedReturn / 100;
  const futureValueOfCurrent = currentAmount * Math.pow(1 + r, yearsToGoal);
  const gap = targetAmount - futureValueOfCurrent;

  if (gap <= 0) return 0;

  // PMT formula for annual contribution
  if (r === 0) return gap / yearsToGoal;
  const annuityFactor = (Math.pow(1 + r, yearsToGoal) - 1) / r;
  return Math.round(gap / annuityFactor);
}

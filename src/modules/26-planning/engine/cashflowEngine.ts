/**
 * Cashflow Engine
 * Expands cashflow items into yearly totals
 */

import { CashflowItem, getAnnualAmount, FlowCategory } from '../schema/cashflowItem';

export interface YearlyCashflow {
  year: number;
  inflows: number;
  outflows: number;
  netCashflow: number;
  byCategory: Record<string, number>;
}

export interface CashflowProjection {
  yearly: YearlyCashflow[];
  totalInflows: number;
  totalOutflows: number;
  netTotal: number;
  largestOutflow: { title: string; amount: number } | null;
  largestInflow: { title: string; amount: number } | null;
}

export function expandCashflowItems(
  items: CashflowItem[],
  startYear: number,
  horizonYears: number,
  inflationPct: number = 0
): CashflowProjection {
  const yearly: YearlyCashflow[] = [];
  let totalInflows = 0;
  let totalOutflows = 0;
  let largestOutflow: { title: string; amount: number } | null = null;
  let largestInflow: { title: string; amount: number } | null = null;

  // Initialize yearly arrays
  for (let i = 0; i < horizonYears; i++) {
    yearly.push({
      year: startYear + i,
      inflows: 0,
      outflows: 0,
      netCashflow: 0,
      byCategory: {},
    });
  }

  // Process each item
  items.forEach(item => {
    const annualAmount = getAnnualAmount(item);
    const itemStartYear = new Date(item.startDate).getFullYear();
    const itemEndYear = item.endDate ? new Date(item.endDate).getFullYear() : startYear + horizonYears;

    // Track largest flows
    if (item.flowType === 'outflow' && (!largestOutflow || annualAmount > largestOutflow.amount)) {
      largestOutflow = { title: item.title, amount: annualAmount };
    }
    if (item.flowType === 'inflow' && (!largestInflow || annualAmount > largestInflow.amount)) {
      largestInflow = { title: item.title, amount: annualAmount };
    }

    yearly.forEach((y, idx) => {
      if (y.year >= itemStartYear && y.year <= itemEndYear) {
        // Apply inflation adjustment if needed
        const inflationMultiplier = item.inflationAdjusted
          ? Math.pow(1 + inflationPct / 100, idx)
          : 1;

        // One-time items only apply in their start year
        if (item.frequency === 'one-time' && y.year !== itemStartYear) {
          return;
        }

        const adjustedAmount = annualAmount * inflationMultiplier;

        if (item.flowType === 'inflow') {
          y.inflows += adjustedAmount;
          totalInflows += adjustedAmount;
        } else {
          y.outflows += adjustedAmount;
          totalOutflows += adjustedAmount;
        }

        // Track by category
        if (!y.byCategory[item.category]) {
          y.byCategory[item.category] = 0;
        }
        y.byCategory[item.category] += item.flowType === 'inflow' ? adjustedAmount : -adjustedAmount;
      }
    });
  });

  // Calculate net cashflow
  yearly.forEach(y => {
    y.netCashflow = y.inflows - y.outflows;
  });

  return {
    yearly,
    totalInflows,
    totalOutflows,
    netTotal: totalInflows - totalOutflows,
    largestOutflow,
    largestInflow,
  };
}

export function getCashflowForPeriod(
  items: CashflowItem[],
  startDate: string,
  endDate: string
): { inflows: number; outflows: number; net: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  let inflows = 0;
  let outflows = 0;

  items.forEach(item => {
    const itemStart = new Date(item.startDate);
    const itemEnd = item.endDate ? new Date(item.endDate) : end;

    if (itemStart <= end && itemEnd >= start) {
      let multiplier = 1;
      switch (item.frequency) {
        case 'monthly': multiplier = Math.min(months, 12); break;
        case 'quarterly': multiplier = Math.min(Math.floor(months / 3), 4); break;
        case 'annual': multiplier = months >= 12 ? 1 : 0; break;
        case 'one-time': multiplier = 1; break;
      }

      const amount = item.amount * multiplier;
      if (item.flowType === 'inflow') {
        inflows += amount;
      } else {
        outflows += amount;
      }
    }
  });

  return { inflows, outflows, net: inflows - outflows };
}

export function summarizeByCategoryType(
  items: CashflowItem[]
): Record<FlowCategory, { inflows: number; outflows: number }> {
  const summary: Record<string, { inflows: number; outflows: number }> = {};

  items.forEach(item => {
    if (!summary[item.category]) {
      summary[item.category] = { inflows: 0, outflows: 0 };
    }
    const annual = getAnnualAmount(item);
    if (item.flowType === 'inflow') {
      summary[item.category].inflows += annual;
    } else {
      summary[item.category].outflows += annual;
    }
  });

  return summary as Record<FlowCategory, { inflows: number; outflows: number }>;
}

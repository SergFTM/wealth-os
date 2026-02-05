/**
 * Plan vs Actual Engine
 * Matches planned cashflow items to actual transactions
 */

import { CashflowItem, getAnnualAmount } from '../schema/cashflowItem';
import { PlanActualLink, ActualRef, calculateGap, getGapStatus } from '../schema/planActualLink';

export interface ActualTransaction {
  id: string;
  type: 'invoice' | 'transaction' | 'gl_entry';
  amount: number;
  date: string;
  category?: string;
  description?: string;
}

export interface MatchResult {
  planItem: CashflowItem;
  matchedActuals: ActualTransaction[];
  plannedAmount: number;
  actualAmount: number;
  gapAmount: number;
  gapPct: number;
  confidence: number;
}

export function matchPlanToActuals(
  planItems: CashflowItem[],
  actuals: ActualTransaction[],
  periodStart: string,
  periodEnd: string
): MatchResult[] {
  const results: MatchResult[] = [];
  const startDate = new Date(periodStart);
  const endDate = new Date(periodEnd);

  // Filter actuals to period
  const periodActuals = actuals.filter(a => {
    const d = new Date(a.date);
    return d >= startDate && d <= endDate;
  });

  planItems.forEach(item => {
    // Get planned amount for period
    const itemStartDate = new Date(item.startDate);
    const itemEndDate = item.endDate ? new Date(item.endDate) : endDate;

    // Skip if item doesn't overlap with period
    if (itemStartDate > endDate || itemEndDate < startDate) {
      return;
    }

    // Calculate planned amount based on frequency
    const monthsInPeriod = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) + 1;

    let plannedAmount = 0;
    switch (item.frequency) {
      case 'monthly':
        plannedAmount = item.amount * monthsInPeriod;
        break;
      case 'quarterly':
        plannedAmount = item.amount * Math.ceil(monthsInPeriod / 3);
        break;
      case 'annual':
        plannedAmount = monthsInPeriod >= 12 ? item.amount : item.amount * (monthsInPeriod / 12);
        break;
      case 'one-time':
        // Check if one-time item falls in period
        if (itemStartDate >= startDate && itemStartDate <= endDate) {
          plannedAmount = item.amount;
        }
        break;
    }

    // Match actuals by category
    const matchedActuals = periodActuals.filter(a =>
      a.category?.toLowerCase() === item.category.toLowerCase()
    );

    const actualAmount = matchedActuals.reduce((sum, a) => sum + Math.abs(a.amount), 0);
    const { amount: gapAmount, pct: gapPct } = calculateGap(plannedAmount, actualAmount);

    // Calculate match confidence
    let confidence = 100;
    if (matchedActuals.length === 0) confidence = 0;
    else if (Math.abs(gapPct) > 20) confidence -= 30;
    else if (Math.abs(gapPct) > 10) confidence -= 15;

    results.push({
      planItem: item,
      matchedActuals,
      plannedAmount: Math.round(plannedAmount),
      actualAmount: Math.round(actualAmount),
      gapAmount: Math.round(gapAmount),
      gapPct,
      confidence: Math.max(0, confidence),
    });
  });

  return results;
}

export function createPlanActualLinks(
  matches: MatchResult[],
  periodStart: string,
  periodEnd: string
): Omit<PlanActualLink, 'id' | 'updatedAt'>[] {
  return matches.map(match => ({
    clientId: match.planItem.clientId,
    planItemId: match.planItem.id,
    planItemTitle: match.planItem.title,
    planCategory: match.planItem.category,
    actualRefs: match.matchedActuals.map(a => ({
      type: a.type,
      id: a.id,
      amount: a.amount,
      date: a.date,
    })),
    periodStart,
    periodEnd,
    plannedAmount: match.plannedAmount,
    actualAmount: match.actualAmount,
    gapAmount: match.gapAmount,
    gapPct: match.gapPct,
    explained: false,
  }));
}

export interface PlanActualSummary {
  totalPlanned: number;
  totalActual: number;
  totalGap: number;
  gapPct: number;
  itemsWithGaps: number;
  itemsExplained: number;
  largestGap: { title: string; amount: number } | null;
  status: 'ok' | 'warning' | 'critical';
}

export function summarizePlanActual(links: PlanActualLink[]): PlanActualSummary {
  if (links.length === 0) {
    return {
      totalPlanned: 0,
      totalActual: 0,
      totalGap: 0,
      gapPct: 0,
      itemsWithGaps: 0,
      itemsExplained: 0,
      largestGap: null,
      status: 'ok',
    };
  }

  const totalPlanned = links.reduce((sum, l) => sum + l.plannedAmount, 0);
  const totalActual = links.reduce((sum, l) => sum + l.actualAmount, 0);
  const totalGap = totalActual - totalPlanned;
  const gapPct = totalPlanned !== 0 ? Math.round((totalGap / Math.abs(totalPlanned)) * 100) : 0;

  const itemsWithGaps = links.filter(l => Math.abs(l.gapPct) > 5).length;
  const itemsExplained = links.filter(l => l.explained).length;

  let largestGap: { title: string; amount: number } | null = null;
  links.forEach(l => {
    const absGap = Math.abs(l.gapAmount);
    if (!largestGap || absGap > Math.abs(largestGap.amount)) {
      largestGap = { title: l.planItemTitle, amount: l.gapAmount };
    }
  });

  const unexplainedGaps = links.filter(l => Math.abs(l.gapPct) > 5 && !l.explained).length;

  let status: 'ok' | 'warning' | 'critical' = 'ok';
  if (unexplainedGaps > 0) status = 'warning';
  if (unexplainedGaps > 3 || Math.abs(gapPct) > 15) status = 'critical';

  return {
    totalPlanned,
    totalActual,
    totalGap,
    gapPct,
    itemsWithGaps,
    itemsExplained,
    largestGap,
    status,
  };
}

export function generateGapNarrative(
  link: PlanActualLink,
  lang: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const gapDirection = link.gapAmount > 0 ? 'over' : 'under';
  const absGap = Math.abs(link.gapAmount);
  const absPct = Math.abs(link.gapPct);

  const templates = {
    over: {
      ru: `${link.planItemTitle}: фактические расходы превысили план на $${absGap.toLocaleString()} (${absPct}%)`,
      en: `${link.planItemTitle}: actual exceeded plan by $${absGap.toLocaleString()} (${absPct}%)`,
      uk: `${link.planItemTitle}: фактичні витрати перевищили план на $${absGap.toLocaleString()} (${absPct}%)`,
    },
    under: {
      ru: `${link.planItemTitle}: фактические расходы ниже плана на $${absGap.toLocaleString()} (${absPct}%)`,
      en: `${link.planItemTitle}: actual was under plan by $${absGap.toLocaleString()} (${absPct}%)`,
      uk: `${link.planItemTitle}: фактичні витрати нижче плану на $${absGap.toLocaleString()} (${absPct}%)`,
    },
  };

  return templates[gapDirection][lang];
}

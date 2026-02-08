/**
 * Collateral Engine
 * Manages collateral valuation and pledged values
 */

import { CreditCollateral } from './types';

export interface CollateralValuationUpdate {
  collateralId: string;
  newValue: number;
  valuationSource: 'market' | 'appraisal' | 'internal' | 'other';
  valuedAt: string;
}

export interface CollateralSummary {
  totalCurrentValue: number;
  totalPledgedValue: number;
  totalHaircut: number;
  byType: Record<string, { count: number; value: number; pledgedValue: number }>;
  currency: string;
}

/**
 * Calculate pledged value after haircut
 */
export function calculatePledgedValue(currentValue: number, haircutPct: number): number {
  return Math.round(currentValue * (1 - haircutPct / 100) * 100) / 100;
}

/**
 * Get default haircut by collateral type
 */
export function getDefaultHaircut(collateralType: string): number {
  const defaults: Record<string, number> = {
    cash: 0,
    securities: 20,
    real_estate: 30,
    equipment: 40,
    inventory: 50,
    receivables: 25,
    other: 50
  };
  return defaults[collateralType] ?? 50;
}

/**
 * Calculate collateral summary
 */
export function calculateCollateralSummary(
  collaterals: CreditCollateral[],
  currency: string = 'USD'
): CollateralSummary {
  const filtered = collaterals.filter(c => c.currency === currency);

  const byType: CollateralSummary['byType'] = {};
  let totalCurrentValue = 0;
  let totalPledgedValue = 0;
  let totalHaircut = 0;

  for (const collateral of filtered) {
    totalCurrentValue += collateral.currentValue;
    totalPledgedValue += collateral.pledgedValue;
    totalHaircut += collateral.currentValue - collateral.pledgedValue;

    const type = collateral.collateralTypeKey;
    if (!byType[type]) {
      byType[type] = { count: 0, value: 0, pledgedValue: 0 };
    }
    byType[type].count++;
    byType[type].value += collateral.currentValue;
    byType[type].pledgedValue += collateral.pledgedValue;
  }

  return {
    totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
    totalPledgedValue: Math.round(totalPledgedValue * 100) / 100,
    totalHaircut: Math.round(totalHaircut * 100) / 100,
    byType,
    currency
  };
}

/**
 * Update collateral valuation
 */
export function applyValuationUpdate(
  collateral: CreditCollateral,
  update: CollateralValuationUpdate
): Partial<CreditCollateral> {
  const newPledgedValue = calculatePledgedValue(update.newValue, collateral.haircutPct);

  return {
    currentValue: update.newValue,
    pledgedValue: newPledgedValue,
    lastValuedAt: update.valuedAt,
    valuationSourceKey: update.valuationSource,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Calculate total collateral for a loan or facility
 */
export function getTotalCollateralForLinked(
  collaterals: CreditCollateral[],
  linkedType: 'facility' | 'loan',
  linkedId: string
): { currentValue: number; pledgedValue: number; items: CreditCollateral[] } {
  const items = collaterals.filter(c => c.linkedType === linkedType && c.linkedId === linkedId);

  return {
    currentValue: items.reduce((sum, c) => sum + c.currentValue, 0),
    pledgedValue: items.reduce((sum, c) => sum + c.pledgedValue, 0),
    items
  };
}

/**
 * Check if collateral needs revaluation
 */
export function needsRevaluation(
  collateral: CreditCollateral,
  maxAgeDays: number = 90
): boolean {
  if (!collateral.lastValuedAt) return true;

  const lastValued = new Date(collateral.lastValuedAt);
  const now = new Date();
  const daysSinceValuation = Math.floor((now.getTime() - lastValued.getTime()) / (24 * 60 * 60 * 1000));

  return daysSinceValuation > maxAgeDays;
}

/**
 * Get collaterals needing revaluation
 */
export function getCollateralsNeedingRevaluation(
  collaterals: CreditCollateral[],
  maxAgeDays: number = 90
): CreditCollateral[] {
  return collaterals.filter(c => needsRevaluation(c, maxAgeDays));
}

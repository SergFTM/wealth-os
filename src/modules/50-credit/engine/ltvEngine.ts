/**
 * LTV Engine
 * Calculates Loan-to-Value and monitors thresholds
 */

import { CreditCollateral, CreditLoan, LtvCalculation } from './types';

export interface LtvBreachEvent {
  collateralId: string;
  loanId?: string;
  facilityId?: string;
  currentLtv: number;
  targetLtv: number;
  breachAmount: number;
  marginCallAmount: number;
  severity: 'warning' | 'breach';
  timestamp: string;
}

/**
 * Calculate LTV for a collateral item
 */
export function calculateLtv(
  loanOutstanding: number,
  pledgedValue: number
): number {
  if (pledgedValue <= 0) return 100;
  return Math.round((loanOutstanding / pledgedValue) * 100 * 100) / 100;
}

/**
 * Determine LTV status
 */
export function determineLtvStatus(
  currentLtv: number,
  targetLtv: number,
  warningBufferPct: number = 10
): 'ok' | 'at_risk' | 'breach' {
  if (currentLtv > targetLtv) {
    return 'breach';
  }

  const warningThreshold = targetLtv * (1 - warningBufferPct / 100);
  if (currentLtv >= warningThreshold) {
    return 'at_risk';
  }

  return 'ok';
}

/**
 * Calculate margin call amount to restore LTV
 */
export function calculateMarginCallAmount(
  loanOutstanding: number,
  currentPledgedValue: number,
  targetLtv: number
): number {
  const requiredPledgedValue = loanOutstanding / (targetLtv / 100);
  const additionalCollateral = requiredPledgedValue - currentPledgedValue;
  return Math.max(0, Math.round(additionalCollateral * 100) / 100);
}

/**
 * Full LTV calculation for a collateral item
 */
export function computeLtvCalculation(
  collateral: CreditCollateral,
  loanOutstanding: number
): LtvCalculation {
  const ltv = calculateLtv(loanOutstanding, collateral.pledgedValue);
  const status = determineLtvStatus(ltv, collateral.targetLtvPct);

  let marginCallAmount: number | undefined;
  if (status !== 'ok') {
    marginCallAmount = calculateMarginCallAmount(
      loanOutstanding,
      collateral.pledgedValue,
      collateral.targetLtvPct
    );
  }

  return {
    collateralId: collateral.id,
    loanOutstanding,
    collateralValue: collateral.currentValue,
    haircut: collateral.haircutPct,
    pledgedValue: collateral.pledgedValue,
    ltv,
    targetLtv: collateral.targetLtvPct,
    status,
    marginCallAmount
  };
}

/**
 * Update collateral with new LTV calculation
 */
export function updateCollateralLtv(
  collateral: CreditCollateral,
  loan: CreditLoan
): Partial<CreditCollateral> {
  const calc = computeLtvCalculation(collateral, loan.outstandingAmount);

  return {
    currentLtvPct: calc.ltv,
    statusKey: calc.status,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Check all collaterals for LTV breaches
 */
export function checkAllLtvBreaches(
  collaterals: CreditCollateral[],
  loans: CreditLoan[]
): LtvBreachEvent[] {
  const events: LtvBreachEvent[] = [];

  for (const collateral of collaterals) {
    let loanOutstanding = 0;
    let loanId: string | undefined;
    let facilityId: string | undefined;

    if (collateral.linkedType === 'loan') {
      const loan = loans.find(l => l.id === collateral.linkedId);
      if (loan) {
        loanOutstanding = loan.outstandingAmount;
        loanId = loan.id;
        facilityId = loan.facilityId;
      }
    }

    const calc = computeLtvCalculation(collateral, loanOutstanding);

    if (calc.status !== 'ok') {
      events.push({
        collateralId: collateral.id,
        loanId,
        facilityId,
        currentLtv: calc.ltv,
        targetLtv: calc.targetLtv,
        breachAmount: calc.marginCallAmount || 0,
        marginCallAmount: calc.marginCallAmount || 0,
        severity: calc.status === 'breach' ? 'breach' : 'warning',
        timestamp: new Date().toISOString()
      });
    }
  }

  return events;
}

/**
 * Get LTV distribution for analytics
 */
export function getLtvDistribution(
  collaterals: CreditCollateral[]
): { bucket: string; count: number; totalValue: number }[] {
  const buckets: Record<string, { count: number; totalValue: number }> = {
    '0-25%': { count: 0, totalValue: 0 },
    '25-50%': { count: 0, totalValue: 0 },
    '50-75%': { count: 0, totalValue: 0 },
    '75-100%': { count: 0, totalValue: 0 },
    '>100%': { count: 0, totalValue: 0 }
  };

  for (const collateral of collaterals) {
    const ltv = collateral.currentLtvPct;
    let bucket: string;

    if (ltv <= 25) bucket = '0-25%';
    else if (ltv <= 50) bucket = '25-50%';
    else if (ltv <= 75) bucket = '50-75%';
    else if (ltv <= 100) bucket = '75-100%';
    else bucket = '>100%';

    buckets[bucket].count++;
    buckets[bucket].totalValue += collateral.pledgedValue;
  }

  return Object.entries(buckets).map(([bucket, data]) => ({
    bucket,
    count: data.count,
    totalValue: Math.round(data.totalValue * 100) / 100
  }));
}

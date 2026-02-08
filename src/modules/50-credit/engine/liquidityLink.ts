/**
 * Liquidity Link
 * Integration with Liquidity Planning module (Module 39)
 */

import { CreditLoan, CreditPayment, ScheduleRow } from './types';

export interface LiquidityCashFlow {
  id: string;
  flowType: 'outflow';
  categoryKey: 'debt_payment' | 'interest_payment';
  flowDate: string;
  amount: number;
  currency: string;
  description: string;
  sourceModule: 'credit';
  sourceRecordId: string;
  isConfirmed: boolean;
  recurrenceJson?: {
    pattern: 'once' | 'monthly' | 'quarterly';
  };
}

/**
 * Convert scheduled payments to liquidity cash flows
 */
export function paymentsToLiquidityFlows(
  payments: CreditPayment[],
  loans: CreditLoan[]
): LiquidityCashFlow[] {
  const flows: LiquidityCashFlow[] = [];

  for (const payment of payments) {
    if (payment.statusKey === 'paid') continue; // Skip already paid

    const loan = loans.find(l => l.id === payment.loanId);
    const loanName = loan?.name || 'Unknown Loan';

    // Principal payment flow
    if (payment.principalPart && payment.principalPart > 0) {
      flows.push({
        id: `cr-principal-${payment.id}`,
        flowType: 'outflow',
        categoryKey: 'debt_payment',
        flowDate: payment.dueAt,
        amount: payment.principalPart,
        currency: payment.currency,
        description: `${loanName} - Principal`,
        sourceModule: 'credit',
        sourceRecordId: payment.id,
        isConfirmed: true,
        recurrenceJson: { pattern: 'once' }
      });
    }

    // Interest payment flow
    if (payment.interestPart && payment.interestPart > 0) {
      flows.push({
        id: `cr-interest-${payment.id}`,
        flowType: 'outflow',
        categoryKey: 'interest_payment',
        flowDate: payment.dueAt,
        amount: payment.interestPart,
        currency: payment.currency,
        description: `${loanName} - Interest`,
        sourceModule: 'credit',
        sourceRecordId: payment.id,
        isConfirmed: true,
        recurrenceJson: { pattern: 'once' }
      });
    }
  }

  return flows;
}

/**
 * Convert schedule to liquidity cash flows (projected)
 */
export function scheduleToLiquidityFlows(
  schedule: ScheduleRow[],
  loan: CreditLoan,
  startFromDate?: Date
): LiquidityCashFlow[] {
  const flows: LiquidityCashFlow[] = [];
  const fromDate = startFromDate || new Date();

  for (const row of schedule) {
    if (new Date(row.dueAt) < fromDate) continue;

    // Principal
    if (row.principalPayment > 0) {
      flows.push({
        id: `cr-sched-principal-${loan.id}-${row.periodNum}`,
        flowType: 'outflow',
        categoryKey: 'debt_payment',
        flowDate: row.dueAt,
        amount: row.principalPayment,
        currency: loan.currency,
        description: `${loan.name} - Scheduled Principal`,
        sourceModule: 'credit',
        sourceRecordId: loan.id,
        isConfirmed: false,
        recurrenceJson: { pattern: 'once' }
      });
    }

    // Interest
    if (row.interestPayment > 0) {
      flows.push({
        id: `cr-sched-interest-${loan.id}-${row.periodNum}`,
        flowType: 'outflow',
        categoryKey: 'interest_payment',
        flowDate: row.dueAt,
        amount: row.interestPayment,
        currency: loan.currency,
        description: `${loan.name} - Scheduled Interest`,
        sourceModule: 'credit',
        sourceRecordId: loan.id,
        isConfirmed: false,
        recurrenceJson: { pattern: 'once' }
      });
    }
  }

  return flows;
}

/**
 * Get total debt payments for a period
 */
export function getTotalDebtPayments(
  payments: CreditPayment[],
  startDate: Date,
  endDate: Date,
  currency: string = 'USD'
): { principal: number; interest: number; total: number } {
  const filtered = payments.filter(p => {
    const dueDate = new Date(p.dueAt);
    return dueDate >= startDate &&
           dueDate <= endDate &&
           p.currency === currency &&
           p.statusKey !== 'paid';
  });

  const principal = filtered.reduce((sum, p) => sum + (p.principalPart || 0), 0);
  const interest = filtered.reduce((sum, p) => sum + (p.interestPart || 0), 0);

  return {
    principal: Math.round(principal * 100) / 100,
    interest: Math.round(interest * 100) / 100,
    total: Math.round((principal + interest) * 100) / 100
  };
}

/**
 * Push payments to liquidity forecast (stub - would call API in real implementation)
 */
export async function pushToLiquidityForecast(
  flows: LiquidityCashFlow[],
  forecastId?: string
): Promise<{ success: boolean; flowsCreated: number; message: string }> {
  // In real implementation, this would call:
  // POST /api/collections/cashFlows with the flows

  console.log(`[Credit→Liquidity] Pushing ${flows.length} flows to forecast ${forecastId || 'default'}`);

  // Stub response
  return {
    success: true,
    flowsCreated: flows.length,
    message: `Pushed ${flows.length} debt payment flows to liquidity forecast`
  };
}

/**
 * Get liquidity impact summary for a loan
 */
export function getLoanLiquidityImpact(
  loan: CreditLoan,
  payments: CreditPayment[],
  horizonDays: number = 365
): {
  nextPayment: { date: string; amount: number } | null;
  next30d: number;
  next90d: number;
  next365d: number;
  totalRemaining: number;
} {
  const now = new Date();
  const day30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const day90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const day365 = new Date(now.getTime() + horizonDays * 24 * 60 * 60 * 1000);

  const loanPayments = payments
    .filter(p => p.loanId === loan.id && p.statusKey !== 'paid')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const nextPayment = loanPayments.length > 0
    ? { date: loanPayments[0].dueAt, amount: loanPayments[0].amount }
    : null;

  const sumPayments = (ps: CreditPayment[]) => ps.reduce((sum, p) => sum + p.amount, 0);

  return {
    nextPayment,
    next30d: sumPayments(loanPayments.filter(p => new Date(p.dueAt) <= day30)),
    next90d: sumPayments(loanPayments.filter(p => new Date(p.dueAt) <= day90)),
    next365d: sumPayments(loanPayments.filter(p => new Date(p.dueAt) <= day365)),
    totalRemaining: sumPayments(loanPayments)
  };
}

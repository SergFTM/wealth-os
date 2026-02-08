/**
 * Interest Calculation Engine
 * Computes periodic interest and interest cost YTD
 */

import { CreditLoan, CreditPayment } from './types';

export interface InterestCalculation {
  loanId: string;
  periodStart: string;
  periodEnd: string;
  daysInPeriod: number;
  principal: number;
  rate: number;
  interestAmount: number;
  method: 'actual_360' | 'actual_365' | '30_360';
}

export interface InterestCostSummary {
  totalInterestYtd: number;
  totalInterestPaid: number;
  totalInterestAccrued: number;
  byLoan: Array<{
    loanId: string;
    loanName: string;
    interestPaid: number;
    interestAccrued: number;
    averageRate: number;
  }>;
  currency: string;
}

/**
 * Calculate days between two dates
 */
function daysBetween(start: Date, end: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
}

/**
 * Get current all-in rate for a loan
 */
export function getCurrentRate(loan: CreditLoan, baseRates: Record<string, number> = {}): number {
  if (loan.rateTypeKey === 'fixed') {
    return loan.fixedRatePct || 0;
  }

  // Floating rate: base + spread
  const baseRateValue = loan.baseRateKey ? (baseRates[loan.baseRateKey] || getDefaultBaseRate(loan.baseRateKey)) : 0;
  const spread = loan.spreadPct || 0;

  return baseRateValue + spread;
}

/**
 * Default base rates (for demo purposes)
 */
function getDefaultBaseRate(baseRateKey: string): number {
  const defaults: Record<string, number> = {
    sofr: 5.33,
    euribor: 3.90,
    sonia: 5.19,
    prime: 8.50,
    libor: 5.40
  };
  return defaults[baseRateKey] || 5.0;
}

/**
 * Calculate interest for a period
 */
export function calculatePeriodInterest(
  principal: number,
  annualRate: number,
  periodStart: Date,
  periodEnd: Date,
  method: 'actual_360' | 'actual_365' | '30_360' = 'actual_360'
): InterestCalculation {
  const days = daysBetween(periodStart, periodEnd);

  let divisor: number;
  let actualDays = days;

  switch (method) {
    case 'actual_360':
      divisor = 360;
      break;
    case 'actual_365':
      divisor = 365;
      break;
    case '30_360':
      divisor = 360;
      // Adjust days for 30/360 convention
      actualDays = Math.floor(days * 30 / 30.44);
      break;
    default:
      divisor = 360;
  }

  const interestAmount = (principal * (annualRate / 100) * actualDays) / divisor;

  return {
    loanId: '',
    periodStart: periodStart.toISOString().split('T')[0],
    periodEnd: periodEnd.toISOString().split('T')[0],
    daysInPeriod: days,
    principal,
    rate: annualRate,
    interestAmount: Math.round(interestAmount * 100) / 100,
    method
  };
}

/**
 * Calculate interest cost YTD from loans and payments
 */
export function calculateInterestCostYtd(
  loans: CreditLoan[],
  payments: CreditPayment[],
  currency: string = 'USD'
): InterestCostSummary {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const byLoan: InterestCostSummary['byLoan'] = [];
  let totalPaid = 0;
  let totalAccrued = 0;

  for (const loan of loans) {
    if (loan.statusKey !== 'active' || loan.currency !== currency) continue;

    // Get payments for this loan YTD
    const loanPayments = payments.filter(p =>
      p.loanId === loan.id &&
      p.statusKey === 'paid' &&
      new Date(p.paidAt || p.dueAt) >= yearStart
    );

    const interestPaid = loanPayments.reduce((sum, p) => sum + (p.interestPart || 0), 0);
    totalPaid += interestPaid;

    // Calculate accrued interest (from last payment to now)
    const lastPaymentDate = loanPayments.length > 0
      ? new Date(Math.max(...loanPayments.map(p => new Date(p.paidAt || p.dueAt).getTime())))
      : new Date(loan.startAt);

    const currentRate = loan.currentRatePct || getCurrentRate(loan);
    const accrued = calculatePeriodInterest(
      loan.outstandingAmount,
      currentRate,
      lastPaymentDate,
      now
    ).interestAmount;

    totalAccrued += accrued;

    byLoan.push({
      loanId: loan.id,
      loanName: loan.name,
      interestPaid,
      interestAccrued: Math.round(accrued * 100) / 100,
      averageRate: currentRate
    });
  }

  return {
    totalInterestYtd: Math.round((totalPaid + totalAccrued) * 100) / 100,
    totalInterestPaid: Math.round(totalPaid * 100) / 100,
    totalInterestAccrued: Math.round(totalAccrued * 100) / 100,
    byLoan,
    currency
  };
}

/**
 * Explain interest cost in natural language (for AI panel)
 */
export function explainInterestCost(
  loans: CreditLoan[],
  payments: CreditPayment[],
  currency: string = 'USD'
): string {
  const summary = calculateInterestCostYtd(loans, payments, currency);

  const lines: string[] = [
    `## Анализ процентных расходов (${currency})`,
    '',
    `**Общие расходы YTD:** ${formatCurrency(summary.totalInterestYtd, currency)}`,
    `- Оплачено: ${formatCurrency(summary.totalInterestPaid, currency)}`,
    `- Начислено (accrued): ${formatCurrency(summary.totalInterestAccrued, currency)}`,
    ''
  ];

  if (summary.byLoan.length > 0) {
    lines.push('### Расходы по займам:');
    lines.push('');

    const sorted = [...summary.byLoan].sort((a, b) =>
      (b.interestPaid + b.interestAccrued) - (a.interestPaid + a.interestAccrued)
    );

    for (const item of sorted.slice(0, 5)) {
      const total = item.interestPaid + item.interestAccrued;
      lines.push(`- **${item.loanName}**: ${formatCurrency(total, currency)} (ставка ${item.averageRate.toFixed(2)}%)`);
    }

    if (sorted.length > 5) {
      lines.push(`- ... и ещё ${sorted.length - 5} займов`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('*Источник: расчёт на основе графика платежей и текущих ставок.*');
  lines.push('*Не является финансовой рекомендацией.*');

  return lines.join('\n');
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

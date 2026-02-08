/**
 * Schedule Engine
 * Generates amortization schedules for loans
 */

import { CreditLoan, ScheduleRow } from './types';

export interface ScheduleGenerationParams {
  loan: CreditLoan;
  startDate?: Date;
  assumedRate?: number;
}

export interface GeneratedSchedule {
  loanId: string;
  rows: ScheduleRow[];
  totalPrincipal: number;
  totalInterest: number;
  totalPayments: number;
  generatedAt: string;
  methodKey: 'simple' | 'actual_360' | 'actual_365' | '30_360';
}

/**
 * Get number of periods based on payment frequency
 */
function getPeriodsPerYear(frequency: string): number {
  switch (frequency) {
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'semi_annual': return 2;
    case 'annual': return 1;
    default: return 12;
  }
}

/**
 * Add months to a date
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Get months per period based on frequency
 */
function getMonthsPerPeriod(frequency: string): number {
  switch (frequency) {
    case 'monthly': return 1;
    case 'quarterly': return 3;
    case 'semi_annual': return 6;
    case 'annual': return 12;
    default: return 1;
  }
}

/**
 * Generate interest-only schedule
 */
function generateInterestOnlySchedule(
  principal: number,
  annualRate: number,
  periodsPerYear: number,
  totalPeriods: number,
  startDate: Date,
  monthsPerPeriod: number
): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  const periodicRate = annualRate / 100 / periodsPerYear;
  const interestPayment = Math.round(principal * periodicRate * 100) / 100;

  let currentDate = new Date(startDate);

  for (let i = 1; i <= totalPeriods; i++) {
    currentDate = addMonths(currentDate, monthsPerPeriod);
    const isLastPeriod = i === totalPeriods;

    rows.push({
      periodNum: i,
      dueAt: currentDate.toISOString().split('T')[0],
      openingBalance: principal,
      principalPayment: isLastPeriod ? principal : 0,
      interestPayment,
      totalPayment: isLastPeriod ? principal + interestPayment : interestPayment,
      closingBalance: isLastPeriod ? 0 : principal
    });
  }

  return rows;
}

/**
 * Generate amortizing schedule (equal payments)
 */
function generateAmortizingSchedule(
  principal: number,
  annualRate: number,
  periodsPerYear: number,
  totalPeriods: number,
  startDate: Date,
  monthsPerPeriod: number
): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  const periodicRate = annualRate / 100 / periodsPerYear;

  // Calculate equal payment amount (PMT formula)
  const payment = principal * (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
    (Math.pow(1 + periodicRate, totalPeriods) - 1);

  let balance = principal;
  let currentDate = new Date(startDate);

  for (let i = 1; i <= totalPeriods; i++) {
    currentDate = addMonths(currentDate, monthsPerPeriod);

    const interestPayment = Math.round(balance * periodicRate * 100) / 100;
    let principalPayment = Math.round((payment - interestPayment) * 100) / 100;

    // Adjust last payment for rounding
    if (i === totalPeriods) {
      principalPayment = Math.round(balance * 100) / 100;
    }

    const newBalance = Math.max(0, Math.round((balance - principalPayment) * 100) / 100);

    rows.push({
      periodNum: i,
      dueAt: currentDate.toISOString().split('T')[0],
      openingBalance: Math.round(balance * 100) / 100,
      principalPayment,
      interestPayment,
      totalPayment: Math.round((principalPayment + interestPayment) * 100) / 100,
      closingBalance: newBalance
    });

    balance = newBalance;
  }

  return rows;
}

/**
 * Generate bullet schedule (all principal at end)
 */
function generateBulletSchedule(
  principal: number,
  annualRate: number,
  periodsPerYear: number,
  totalPeriods: number,
  startDate: Date,
  monthsPerPeriod: number
): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  const periodicRate = annualRate / 100 / periodsPerYear;
  const interestPayment = Math.round(principal * periodicRate * 100) / 100;

  let currentDate = new Date(startDate);

  for (let i = 1; i <= totalPeriods; i++) {
    currentDate = addMonths(currentDate, monthsPerPeriod);
    const isLastPeriod = i === totalPeriods;

    rows.push({
      periodNum: i,
      dueAt: currentDate.toISOString().split('T')[0],
      openingBalance: principal,
      principalPayment: isLastPeriod ? principal : 0,
      interestPayment,
      totalPayment: isLastPeriod ? principal + interestPayment : interestPayment,
      closingBalance: isLastPeriod ? 0 : principal
    });
  }

  return rows;
}

/**
 * Generate amortization schedule for a loan
 */
export function generateSchedule(params: ScheduleGenerationParams): GeneratedSchedule {
  const { loan, startDate, assumedRate } = params;

  const rate = assumedRate ?? loan.currentRatePct ?? loan.fixedRatePct ?? 5.0;
  const start = startDate ?? new Date(loan.startAt);
  const maturity = new Date(loan.maturityAt);

  const periodsPerYear = getPeriodsPerYear(loan.paymentFrequencyKey);
  const monthsPerPeriod = getMonthsPerPeriod(loan.paymentFrequencyKey);

  // Calculate total periods
  const monthsDiff = (maturity.getFullYear() - start.getFullYear()) * 12 +
    (maturity.getMonth() - start.getMonth());
  const totalPeriods = Math.max(1, Math.floor(monthsDiff / monthsPerPeriod));

  let rows: ScheduleRow[];

  switch (loan.amortizationTypeKey) {
    case 'interest_only':
      rows = generateInterestOnlySchedule(
        loan.principalAmount, rate, periodsPerYear, totalPeriods, start, monthsPerPeriod
      );
      break;
    case 'amortizing':
      rows = generateAmortizingSchedule(
        loan.principalAmount, rate, periodsPerYear, totalPeriods, start, monthsPerPeriod
      );
      break;
    case 'bullet':
      rows = generateBulletSchedule(
        loan.principalAmount, rate, periodsPerYear, totalPeriods, start, monthsPerPeriod
      );
      break;
    default:
      rows = generateInterestOnlySchedule(
        loan.principalAmount, rate, periodsPerYear, totalPeriods, start, monthsPerPeriod
      );
  }

  const totalPrincipal = rows.reduce((sum, r) => sum + r.principalPayment, 0);
  const totalInterest = rows.reduce((sum, r) => sum + r.interestPayment, 0);

  return {
    loanId: loan.id,
    rows,
    totalPrincipal: Math.round(totalPrincipal * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayments: Math.round((totalPrincipal + totalInterest) * 100) / 100,
    generatedAt: new Date().toISOString(),
    methodKey: 'simple'
  };
}

/**
 * Get upcoming payments from schedule
 */
export function getUpcomingPayments(
  schedule: ScheduleRow[],
  fromDate: Date = new Date(),
  count: number = 5
): ScheduleRow[] {
  return schedule
    .filter(row => new Date(row.dueAt) >= fromDate)
    .slice(0, count);
}

/**
 * Get next payment date from schedule
 */
export function getNextPaymentDate(schedule: ScheduleRow[]): string | null {
  const now = new Date();
  const upcoming = schedule.find(row => new Date(row.dueAt) >= now);
  return upcoming?.dueAt ?? null;
}

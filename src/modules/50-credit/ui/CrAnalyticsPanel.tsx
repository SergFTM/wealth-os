"use client";

import { CreditLoan, CreditPayment, CreditCollateral } from '../engine/types';

interface CrAnalyticsPanelProps {
  loans: CreditLoan[];
  payments: CreditPayment[];
  collaterals: CreditCollateral[];
  currency?: string;
}

export function CrAnalyticsPanel({
  loans,
  payments,
  collaterals,
  currency = 'USD',
}: CrAnalyticsPanelProps) {
  // Filter by currency
  const filteredLoans = loans.filter((l) => l.currency === currency && l.statusKey === 'active');
  const filteredPayments = payments.filter((p) => p.currency === currency);

  // Debt by entity
  const debtByEntity: Record<string, number> = {};
  for (const loan of filteredLoans) {
    const entity = loan.borrowerEntityId || 'Unknown';
    debtByEntity[entity] = (debtByEntity[entity] || 0) + loan.outstandingAmount;
  }

  // Interest YTD
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const ytdPayments = filteredPayments.filter(
    (p) => p.statusKey === 'paid' && new Date(p.paidAt || p.dueAt) >= yearStart
  );
  const interestYtd = ytdPayments.reduce((sum, p) => sum + (p.interestPart || 0), 0);
  const principalYtd = ytdPayments.reduce((sum, p) => sum + (p.principalPart || 0), 0);

  // Rate distribution
  const rateDistribution: { fixed: number; floating: number } = { fixed: 0, floating: 0 };
  for (const loan of filteredLoans) {
    if (loan.rateTypeKey === 'fixed') {
      rateDistribution.fixed += loan.outstandingAmount;
    } else {
      rateDistribution.floating += loan.outstandingAmount;
    }
  }

  // Maturity profile
  const now = Date.now();
  const maturityBuckets = { '<1Y': 0, '1-2Y': 0, '2-5Y': 0, '>5Y': 0 };
  for (const loan of filteredLoans) {
    const yearsToMaturity = (new Date(loan.maturityAt).getTime() - now) / (365 * 24 * 60 * 60 * 1000);
    if (yearsToMaturity < 1) maturityBuckets['<1Y'] += loan.outstandingAmount;
    else if (yearsToMaturity < 2) maturityBuckets['1-2Y'] += loan.outstandingAmount;
    else if (yearsToMaturity < 5) maturityBuckets['2-5Y'] += loan.outstandingAmount;
    else maturityBuckets['>5Y'] += loan.outstandingAmount;
  }

  // LTV distribution
  const ltvBuckets = { '0-50%': 0, '50-75%': 0, '75-100%': 0, '>100%': 0 };
  for (const col of collaterals) {
    const ltv = col.currentLtvPct;
    if (ltv <= 50) ltvBuckets['0-50%']++;
    else if (ltv <= 75) ltvBuckets['50-75%']++;
    else if (ltv <= 100) ltvBuckets['75-100%']++;
    else ltvBuckets['>100%']++;
  }

  const totalDebt = filteredLoans.reduce((sum, l) => sum + l.outstandingAmount, 0);
  const avgRate = filteredLoans.length > 0
    ? filteredLoans.reduce((sum, l) => sum + (l.currentRatePct || l.fixedRatePct || 0) * l.outstandingAmount, 0) / totalDebt
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Total Debt</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(totalDebt)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Avg Rate</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {avgRate.toFixed(2)}%
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Interest YTD</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(interestYtd)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Principal Paid YTD</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(principalYtd)}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rate Distribution */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Rate Type Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone-600">Fixed</span>
                <span className="font-medium">{formatCurrency(rateDistribution.fixed)}</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${totalDebt > 0 ? (rateDistribution.fixed / totalDebt) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone-600">Floating</span>
                <span className="font-medium">{formatCurrency(rateDistribution.floating)}</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${totalDebt > 0 ? (rateDistribution.floating / totalDebt) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Maturity Profile */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Maturity Profile</h3>
          <div className="space-y-3">
            {Object.entries(maturityBuckets).map(([bucket, amount]) => (
              <div key={bucket}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">{bucket}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${totalDebt > 0 ? (amount / totalDebt) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Debt by Entity */}
      {Object.keys(debtByEntity).length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Debt by Entity</h3>
          <div className="space-y-3">
            {Object.entries(debtByEntity)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([entity, amount]) => (
                <div key={entity}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">{entity}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${totalDebt > 0 ? (amount / totalDebt) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* LTV Distribution */}
      {collaterals.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">LTV Distribution (Collateral Count)</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(ltvBuckets).map(([bucket, count]) => {
              const color = bucket === '>100%' ? 'bg-red-50 text-red-700' :
                bucket === '75-100%' ? 'bg-amber-50 text-amber-700' :
                'bg-emerald-50 text-emerald-700';
              return (
                <div key={bucket} className={`rounded-lg p-3 ${color}`}>
                  <div className="text-xs opacity-75">{bucket}</div>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

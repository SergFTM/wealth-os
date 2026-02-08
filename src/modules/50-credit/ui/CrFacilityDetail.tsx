"use client";

import { CreditFacility, CreditLoan, CreditCovenant, CreditCollateral, CreditBank } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

export interface CrFacilityDetailProps {
  facility: CreditFacility;
  bank?: CreditBank;
  loans: CreditLoan[];
  covenants: CreditCovenant[];
  collaterals?: CreditCollateral[];
  bankName?: string;
  onBack?: () => void;
  onOpenLoan?: (id: string) => void;
  onOpenCovenant?: (id: string) => void;
  onOpenBank?: (bankId: string) => void;
  onDrawdown?: () => void;
  onEdit?: () => void;
  onShowAudit?: () => void;
}

export function CrFacilityDetail({
  facility,
  bank,
  loans,
  covenants,
  collaterals = [],
  bankName,
  onBack,
  onOpenLoan,
  onOpenCovenant,
  onOpenBank,
  onDrawdown,
  onEdit,
  onShowAudit,
}: CrFacilityDetailProps) {
  const utilizationPct = facility.limitAmount > 0
    ? (facility.drawnAmount / facility.limitAmount) * 100
    : 0;

  const daysToMaturity = Math.floor(
    (new Date(facility.maturityAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-stone-800">{facility.name}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {(bank?.name || bankName) && (
                <span className="mr-3 cursor-pointer hover:text-stone-700" onClick={() => bank && onOpenBank?.(bank.id)}>
                  {bank?.name || bankName}
                </span>
              )}
              <span className="capitalize">{facility.facilityTypeKey}</span>
              <span className="mx-2">•</span>
              <span>{facility.currency}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CrStatusPill status={facility.statusKey} size="md" />
          {onDrawdown && (
            <button onClick={onDrawdown} className="px-3 py-1.5 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50">
              Drawdown
            </button>
          )}
          {onShowAudit && (
            <button onClick={onShowAudit} className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50">
              Аудит
            </button>
          )}
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Редактировать
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Лимит</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(facility.limitAmount)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Drawn</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(facility.drawnAmount)}
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="text-sm text-emerald-600">Available</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {formatCurrency(facility.availableAmount)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Utilization</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {utilizationPct.toFixed(0)}%
          </div>
          <div className="mt-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                utilizationPct > 90 ? 'bg-red-500' : utilizationPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, utilizationPct)}%` }}
            />
          </div>
        </div>
        <div className={`rounded-xl p-4 ${daysToMaturity <= 180 ? 'bg-amber-50' : 'bg-stone-50'}`}>
          <div className={`text-sm ${daysToMaturity <= 180 ? 'text-amber-600' : 'text-stone-500'}`}>
            Maturity
          </div>
          <div className={`text-lg font-bold mt-1 ${daysToMaturity <= 180 ? 'text-amber-700' : 'text-stone-800'}`}>
            {new Date(facility.maturityAt).toLocaleDateString('ru-RU')}
          </div>
          <div className={`text-xs mt-0.5 ${daysToMaturity <= 180 ? 'text-amber-600' : 'text-stone-500'}`}>
            {daysToMaturity > 0 ? `${daysToMaturity} дней` : 'Истёк'}
          </div>
        </div>
      </div>

      {/* Loans */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Займы ({loans.length})</h3>
        </div>
        {loans.length === 0 ? (
          <div className="p-6 text-center text-stone-400">Нет займов</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">Название</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Principal</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Outstanding</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Ставка</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr
                  key={loan.id}
                  className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer"
                  onClick={() => onOpenLoan?.(loan.id)}
                >
                  <td className="px-4 py-2 font-medium text-stone-800">{loan.name}</td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(loan.principalAmount)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-stone-800">
                    {formatCurrency(loan.outstandingAmount)}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {(loan.currentRatePct || loan.fixedRatePct || 0).toFixed(2)}%
                  </td>
                  <td className="px-4 py-2">
                    <CrStatusPill status={loan.statusKey} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Covenants */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h3 className="font-semibold text-stone-800">Ковенанты ({covenants.length})</h3>
        </div>
        {covenants.length === 0 ? (
          <div className="p-6 text-center text-stone-400">Нет ковенантов</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">Ковенант</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Тип</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Порог</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Текущее</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
              </tr>
            </thead>
            <tbody>
              {covenants.map((covenant) => (
                <tr
                  key={covenant.id}
                  className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer"
                  onClick={() => onOpenCovenant?.(covenant.id)}
                >
                  <td className="px-4 py-2 font-medium text-stone-800">{covenant.name}</td>
                  <td className="px-4 py-2 text-stone-600">{covenant.covenantTypeKey}</td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {covenant.thresholdJson.operator} {covenant.thresholdJson.value}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-stone-800">
                    {covenant.currentValueJson?.value ?? '—'}
                  </td>
                  <td className="px-4 py-2">
                    <CrStatusPill status={covenant.statusKey} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Collateral */}
      {collaterals.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100">
            <h3 className="font-semibold text-stone-800">Залоги ({collaterals.length})</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">Описание</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Тип</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Value</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">LTV</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
              </tr>
            </thead>
            <tbody>
              {collaterals.map((col) => (
                <tr key={col.id} className="border-b border-stone-50">
                  <td className="px-4 py-2 font-medium text-stone-800">
                    {col.description || 'Залог'}
                  </td>
                  <td className="px-4 py-2 text-stone-600">{col.collateralTypeKey}</td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(col.pledgedValue)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-stone-800">
                    {col.currentLtvPct?.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2">
                    <CrStatusPill status={col.statusKey} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

"use client";

import { CreditLoan, CreditPayment, CreditCollateral, CreditCovenant, CreditFacility, CreditSchedule, ScheduleRow } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

export interface CrLoanDetailProps {
  loan: CreditLoan;
  facility?: CreditFacility;
  payments: CreditPayment[];
  collaterals: CreditCollateral[];
  covenants: CreditCovenant[];
  schedule?: CreditSchedule | ScheduleRow[];
  facilityName?: string;
  onBack?: () => void;
  onGenerateSchedule?: () => void;
  onSchedulePayment?: () => void;
  onRecordPayment?: (paymentId: string) => void;
  onEdit?: () => void;
  onOpenFacility?: (facilityId: string) => void;
  onOpenCollateral?: (collateralId: string) => void;
  onOpenCovenant?: (covenantId: string) => void;
  onOpenPayment?: (paymentId: string) => void;
  onAddCollateral?: () => void;
  onShowAudit?: () => void;
}

export function CrLoanDetail({
  loan,
  facility,
  payments,
  collaterals,
  covenants,
  schedule: scheduleProp = [],
  facilityName,
  onBack,
  onGenerateSchedule,
  onSchedulePayment,
  onRecordPayment,
  onEdit,
  onOpenFacility,
  onOpenCollateral,
  onOpenCovenant,
  onOpenPayment,
  onAddCollateral,
  onShowAudit,
}: CrLoanDetailProps) {
  const schedule: ScheduleRow[] = Array.isArray(scheduleProp)
    ? scheduleProp
    : (scheduleProp as CreditSchedule)?.scheduleJson ?? [];
  const rate = loan.currentRatePct || loan.fixedRatePct || 0;
  const daysToMaturity = Math.floor(
    (new Date(loan.maturityAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  const upcomingPayments = payments
    .filter((p) => p.statusKey === 'scheduled' && new Date(p.dueAt) >= new Date())
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5);

  const paidPayments = payments.filter((p) => p.statusKey === 'paid');
  const totalInterestPaid = paidPayments.reduce((sum, p) => sum + (p.interestPart || 0), 0);
  const totalPrincipalPaid = paidPayments.reduce((sum, p) => sum + (p.principalPart || 0), 0);

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
            <h2 className="text-xl font-bold text-stone-800">{loan.name}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {(facility?.name || facilityName) && (
                <span className="mr-3 cursor-pointer hover:text-stone-700" onClick={() => facility && onOpenFacility?.(facility.id)}>
                  {facility?.name || facilityName}
                </span>
              )}
              <span>{loan.currency}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{loan.amortizationTypeKey.replace('_', ' ')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CrStatusPill status={loan.statusKey} size="md" />
          {onAddCollateral && (
            <button onClick={onAddCollateral} className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50">
              + Залог
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Principal</div>
          <div className="text-xl font-bold text-stone-800 mt-1">
            {formatCurrency(loan.principalAmount)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Outstanding</div>
          <div className="text-xl font-bold text-stone-800 mt-1">
            {formatCurrency(loan.outstandingAmount)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Погашено</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {formatCurrency(totalPrincipalPaid)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Ставка</div>
          <div className="text-xl font-bold text-stone-800 mt-1">{rate.toFixed(2)}%</div>
          <div className="text-xs text-stone-400">
            {loan.rateTypeKey === 'floating'
              ? `${loan.baseRateKey?.toUpperCase()} + ${loan.spreadPct}%`
              : 'фиксированная'}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Проценты уплачено</div>
          <div className="text-xl font-bold text-stone-800 mt-1">
            {formatCurrency(totalInterestPaid)}
          </div>
        </div>
        <div className={`rounded-xl p-4 ${daysToMaturity <= 180 ? 'bg-amber-50' : 'bg-stone-50'}`}>
          <div className={`text-sm ${daysToMaturity <= 180 ? 'text-amber-600' : 'text-stone-500'}`}>
            Maturity
          </div>
          <div className={`text-lg font-bold mt-1 ${daysToMaturity <= 180 ? 'text-amber-700' : 'text-stone-800'}`}>
            {new Date(loan.maturityAt).toLocaleDateString('ru-RU')}
          </div>
          <div className="text-xs text-stone-400">{daysToMaturity} дней</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onGenerateSchedule}
          className="px-3 py-1.5 text-sm font-medium bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
        >
          Сгенерировать график
        </button>
        <button
          onClick={onSchedulePayment}
          className="px-3 py-1.5 text-sm font-medium bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
        >
          Запланировать платеж
        </button>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Предстоящие платежи</h3>
          <span className="text-sm text-stone-500">{upcomingPayments.length} платежей</span>
        </div>
        {upcomingPayments.length === 0 ? (
          <div className="p-6 text-center text-stone-400">Нет запланированных платежей</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">Дата</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Principal</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Interest</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Всего</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
                <th className="text-center px-4 py-2 font-medium text-stone-600">Действие</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-stone-50">
                  <td className="px-4 py-2 text-stone-800">
                    {new Date(payment.dueAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(payment.principalPart || 0)}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(payment.interestPart || 0)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-stone-800">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-2">
                    <CrStatusPill status={payment.statusKey} />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onRecordPayment?.(payment.id)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Оплатить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Preview */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100">
            <h3 className="font-semibold text-stone-800">
              Amortization Schedule (первые 6 периодов)
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">#</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Дата</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Opening</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Principal</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Interest</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Total</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Closing</th>
              </tr>
            </thead>
            <tbody>
              {schedule.slice(0, 6).map((row) => (
                <tr key={row.periodNum} className="border-b border-stone-50">
                  <td className="px-4 py-2 text-stone-600">{row.periodNum}</td>
                  <td className="px-4 py-2 text-stone-800">
                    {new Date(row.dueAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(row.openingBalance)}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(row.principalPayment)}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(row.interestPayment)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-stone-800">
                    {formatCurrency(row.totalPayment)}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(row.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                <th className="text-right px-4 py-2 font-medium text-stone-600">Haircut</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">LTV</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
              </tr>
            </thead>
            <tbody>
              {collaterals.map((col) => (
                <tr key={col.id} className="border-b border-stone-50">
                  <td className="px-4 py-2 text-stone-800">{col.description || 'Залог'}</td>
                  <td className="px-4 py-2 text-stone-600 capitalize">{col.collateralTypeKey}</td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(col.currentValue)}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">{col.haircutPct}%</td>
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

      {/* Covenants */}
      {covenants.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100">
            <h3 className="font-semibold text-stone-800">Ковенанты ({covenants.length})</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">Ковенант</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Порог</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Текущее</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">След. тест</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
              </tr>
            </thead>
            <tbody>
              {covenants.map((cov) => (
                <tr key={cov.id} className="border-b border-stone-50">
                  <td className="px-4 py-2 text-stone-800">{cov.name}</td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {cov.thresholdJson.operator} {cov.thresholdJson.value}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-stone-800">
                    {cov.currentValueJson?.value ?? '—'}
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {cov.nextTestAt ? new Date(cov.nextTestAt).toLocaleDateString('ru-RU') : '—'}
                  </td>
                  <td className="px-4 py-2">
                    <CrStatusPill status={cov.statusKey} />
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

"use client";

import { CreditCovenant, CreditLoan, CreditFacility } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

export interface CrCovenantDetailProps {
  covenant: CreditCovenant;
  loan?: CreditLoan;
  facility?: CreditFacility;
  linkedName?: string;
  onBack?: () => void;
  onTest?: () => void;
  onRequestWaiver?: () => void;
  onEdit?: () => void;
  onOpenLoan?: (loanId: string) => void;
  onOpenFacility?: (facilityId: string) => void;
  onShowAudit?: () => void;
}

export function CrCovenantDetail({
  covenant,
  loan,
  facility,
  linkedName,
  onBack,
  onTest,
  onRequestWaiver,
  onEdit,
  onOpenLoan,
  onOpenFacility,
  onShowAudit,
}: CrCovenantDetailProps) {
  const currentValue = covenant.currentValueJson?.value;
  const threshold = covenant.thresholdJson.value;
  const isCompliant = currentValue !== undefined && checkCompliance(currentValue, covenant.thresholdJson);

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
            <h2 className="text-xl font-bold text-stone-800">{covenant.name}</h2>
            <p className="text-sm text-stone-500 mt-1">
              <span className="capitalize">{covenant.covenantTypeKey.replace('_', ' ')}</span>
              {linkedName && (
                <>
                  <span className="mx-2">•</span>
                  <span>{linkedName}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CrStatusPill status={covenant.statusKey} size="md" />
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

      {/* Breach Alert */}
      {covenant.statusKey === 'breach' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-red-800">Covenant Breach</div>
              <p className="text-sm text-red-700 mt-1">
                Текущее значение ({currentValue?.toFixed(2)}) не соответствует порогу ({covenant.thresholdJson.operator} {threshold}).
                Требуется немедленное уведомление банка.
              </p>
              <button
                onClick={onRequestWaiver}
                className="mt-3 px-3 py-1.5 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-100"
              >
                Запросить waiver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Порог</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {covenant.thresholdJson.operator} {threshold}
          </div>
          {covenant.thresholdJson.unit && (
            <div className="text-xs text-stone-400">{covenant.thresholdJson.unit}</div>
          )}
        </div>
        <div className={`rounded-xl p-4 ${
          covenant.statusKey === 'breach' ? 'bg-red-50' :
          covenant.statusKey === 'at_risk' ? 'bg-amber-50' : 'bg-emerald-50'
        }`}>
          <div className={`text-sm ${
            covenant.statusKey === 'breach' ? 'text-red-600' :
            covenant.statusKey === 'at_risk' ? 'text-amber-600' : 'text-emerald-600'
          }`}>Текущее значение</div>
          <div className={`text-2xl font-bold mt-1 ${
            covenant.statusKey === 'breach' ? 'text-red-700' :
            covenant.statusKey === 'at_risk' ? 'text-amber-700' : 'text-emerald-700'
          }`}>
            {currentValue?.toFixed(2) ?? '—'}
          </div>
          {covenant.currentValueJson?.asOf && (
            <div className="text-xs text-stone-400">
              на {new Date(covenant.currentValueJson.asOf).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Buffer</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {covenant.bufferPct ?? 10}%
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Частота теста</div>
          <div className="text-lg font-bold text-stone-800 mt-1 capitalize">
            {covenant.testFrequencyKey}
          </div>
        </div>
      </div>

      {/* Test Dates */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Тестирование</h3>
          <button
            onClick={onTest}
            className="px-3 py-1.5 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50"
          >
            Запустить тест
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-stone-400">Последний тест</div>
            <div className="text-sm font-medium text-stone-700">
              {covenant.lastTestAt
                ? new Date(covenant.lastTestAt).toLocaleDateString('ru-RU')
                : 'Не проводился'}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Следующий тест</div>
            <div className="text-sm font-medium text-stone-700">
              {covenant.nextTestAt
                ? new Date(covenant.nextTestAt).toLocaleDateString('ru-RU')
                : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Waiver Status */}
      {covenant.waiverStatusKey && covenant.waiverStatusKey !== 'none' && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Waiver</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-stone-400">Статус waiver</div>
              <div className="text-sm font-medium text-stone-700 capitalize">
                {covenant.waiverStatusKey}
              </div>
            </div>
            {covenant.waiverExpiresAt && (
              <div>
                <div className="text-xs text-stone-400">Истекает</div>
                <div className="text-sm font-medium text-stone-700">
                  {new Date(covenant.waiverExpiresAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calculation Method */}
      {covenant.calculationMethodDescription && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Метод расчёта</h3>
          <p className="text-sm text-stone-600">{covenant.calculationMethodDescription}</p>
        </div>
      )}

      {/* Linked Objects */}
      {(loan || facility) && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Связанные объекты</h3>
          <div className="space-y-2">
            {loan && (
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer" onClick={() => onOpenLoan?.(loan.id)}>
                <div>
                  <div className="text-xs text-stone-400">Loan</div>
                  <div className="text-sm font-medium text-stone-700">{loan.name}</div>
                </div>
                <div className="text-sm text-stone-500">{loan.outstandingAmount.toLocaleString()} {loan.currency}</div>
              </div>
            )}
            {facility && (
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer" onClick={() => onOpenFacility?.(facility.id)}>
                <div>
                  <div className="text-xs text-stone-400">Facility</div>
                  <div className="text-sm font-medium text-stone-700">{facility.name}</div>
                </div>
                <div className="text-sm text-stone-500">{facility.limitAmount.toLocaleString()} {facility.currency}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {covenant.notes && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Заметки</h3>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{covenant.notes}</p>
        </div>
      )}
    </div>
  );
}

function checkCompliance(
  value: number,
  threshold: { operator: string; value: number }
): boolean {
  switch (threshold.operator) {
    case '>=': return value >= threshold.value;
    case '<=': return value <= threshold.value;
    case '>': return value > threshold.value;
    case '<': return value < threshold.value;
    case '==': return value === threshold.value;
    default: return false;
  }
}

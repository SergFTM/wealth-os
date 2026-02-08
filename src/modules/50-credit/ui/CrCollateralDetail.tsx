"use client";

import { CreditCollateral, CreditLoan, CreditFacility } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

export interface CrCollateralDetailProps {
  collateral: CreditCollateral;
  loan?: CreditLoan;
  facility?: CreditFacility;
  linkedName?: string;
  onBack?: () => void;
  onUpdateValuation?: () => void;
  onEdit?: () => void;
  onOpenLoan?: (loanId: string) => void;
  onOpenFacility?: (facilityId: string) => void;
  onRevalue?: () => void;
  onShowAudit?: () => void;
}

export function CrCollateralDetail({
  collateral,
  loan,
  facility,
  linkedName,
  onBack,
  onUpdateValuation,
  onEdit,
  onOpenLoan,
  onOpenFacility,
  onRevalue,
  onShowAudit,
}: CrCollateralDetailProps) {
  const isOverTarget = collateral.currentLtvPct > collateral.targetLtvPct;
  const marginCallAmount = isOverTarget
    ? (collateral.currentLtvPct - collateral.targetLtvPct) / 100 * collateral.pledgedValue
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              {collateral.description || 'Collateral'}
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              <span className="capitalize">{collateral.collateralTypeKey}</span>
              <span className="mx-2">•</span>
              <span>{collateral.currency}</span>
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
          <CrStatusPill status={collateral.statusKey} size="md" />
          {onShowAudit && (
            <button
              onClick={onShowAudit}
              className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              Аудит
            </button>
          )}
          {onRevalue && (
            <button
              onClick={onRevalue}
              className="px-3 py-1.5 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50"
            >
              Переоценка
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

      {/* Alert Banner */}
      {collateral.statusKey === 'breach' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-red-800">LTV Breach</div>
              <p className="text-sm text-red-700 mt-1">
                Текущий LTV ({collateral.currentLtvPct.toFixed(1)}%) превышает целевой ({collateral.targetLtvPct}%).
                Требуется дополнительный залог ~{formatCurrency(marginCallAmount)} для восстановления LTV.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Current Value</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(collateral.currentValue)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Haircut</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {collateral.haircutPct}%
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="text-sm text-emerald-600">Pledged Value</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {formatCurrency(collateral.pledgedValue)}
          </div>
        </div>
        <div className={`rounded-xl p-4 ${isOverTarget ? 'bg-red-50' : 'bg-stone-50'}`}>
          <div className={`text-sm ${isOverTarget ? 'text-red-600' : 'text-stone-500'}`}>
            LTV
          </div>
          <div className={`text-2xl font-bold mt-1 ${isOverTarget ? 'text-red-700' : 'text-stone-800'}`}>
            {collateral.currentLtvPct.toFixed(1)}%
          </div>
          <div className="text-xs text-stone-400 mt-0.5">
            Target: {collateral.targetLtvPct}%
          </div>
        </div>
      </div>

      {/* LTV Gauge */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <h3 className="font-semibold text-stone-800 mb-4">LTV Monitor</h3>
        <div className="relative h-8 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all ${
              collateral.currentLtvPct > collateral.targetLtvPct
                ? 'bg-red-500'
                : collateral.currentLtvPct > collateral.targetLtvPct * 0.9
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, collateral.currentLtvPct)}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-stone-800"
            style={{ left: `${Math.min(100, collateral.targetLtvPct)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-500 mt-2">
          <span>0%</span>
          <span>Target: {collateral.targetLtvPct}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Valuation Info */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Valuation</h3>
          <button
            onClick={onUpdateValuation}
            className="px-3 py-1.5 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50"
          >
            Обновить оценку
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-stone-400">Дата оценки</div>
            <div className="text-sm font-medium text-stone-700">
              {collateral.lastValuedAt
                ? new Date(collateral.lastValuedAt).toLocaleDateString('ru-RU')
                : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Источник</div>
            <div className="text-sm font-medium text-stone-700 capitalize">
              {collateral.valuationSourceKey || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Reference */}
      {collateral.assetRefJson && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Связанный актив</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-stone-400">Тип актива</div>
              <div className="text-sm font-medium text-stone-700">
                {collateral.assetRefJson.assetType || '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-400">ID актива</div>
              <div className="text-sm font-medium text-stone-700">
                {collateral.assetRefJson.assetId || '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-400">Модуль</div>
              <div className="text-sm font-medium text-stone-700">
                {collateral.assetRefJson.assetModule || '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Linked Loan / Facility */}
      {(loan || facility) && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Связанные объекты</h3>
          <div className="space-y-2">
            {loan && (
              <div
                className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer"
                onClick={() => onOpenLoan?.(loan.id)}
              >
                <div>
                  <div className="text-xs text-stone-400">Loan</div>
                  <div className="text-sm font-medium text-stone-700">{loan.name}</div>
                </div>
                <div className="text-sm text-stone-500">{formatCurrency(loan.outstandingAmount)}</div>
              </div>
            )}
            {facility && (
              <div
                className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer"
                onClick={() => onOpenFacility?.(facility.id)}
              >
                <div>
                  <div className="text-xs text-stone-400">Facility</div>
                  <div className="text-sm font-medium text-stone-700">{facility.name}</div>
                </div>
                <div className="text-sm text-stone-500">{formatCurrency(facility.limitAmount)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {collateral.notes && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Заметки</h3>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{collateral.notes}</p>
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

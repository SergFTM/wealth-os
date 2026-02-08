'use client';

import React from 'react';
import { DataOverride } from '../engine/types';
import { OVERRIDE_TYPES, OVERRIDE_STATUSES } from '../config';
import { getOverrideEffectDescription, getAvailableTransitions } from '../engine/overrideEngine';

interface DgOverrideDetailProps {
  override: DataOverride;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
  onApply?: () => void;
  onSubmit?: () => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgOverrideDetail({
  override,
  onApprove,
  onReject,
  onApply,
  onSubmit,
  locale = 'ru',
}: DgOverrideDetailProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValue = (value: number | string | undefined, currency?: string) => {
    if (typeof value === 'number' && currency) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    }
    if (typeof value === 'number') {
      return new Intl.NumberFormat('ru-RU').format(value);
    }
    return value ?? '—';
  };

  const statusColorMap: Record<string, string> = {
    draft: 'bg-stone-100 text-stone-600 border-stone-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    applied: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const transitions = getAvailableTransitions(override.statusKey);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Override: {override.targetName || override.targetId}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColorMap[override.statusKey]}`}>
              {OVERRIDE_STATUSES[override.statusKey]?.[locale] || override.statusKey}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">
              {OVERRIDE_TYPES[override.overrideTypeKey]?.[locale] || override.overrideTypeKey}
            </span>
          </div>
        </div>
      </div>

      {/* Effect Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-200/50">
        <h3 className="text-sm font-medium text-stone-500 mb-2">
          {locale === 'ru' ? 'Эффект' : 'Effect'}
        </h3>
        <div className="text-lg font-semibold text-stone-900">
          {getOverrideEffectDescription(override, locale)}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Value Details */}
        <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
          <h3 className="font-medium text-stone-800 mb-3">
            {locale === 'ru' ? 'Значения' : 'Values'}
          </h3>
          <dl className="space-y-2 text-sm">
            {override.valueJson.oldValue !== undefined && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Было' : 'Old Value'}</dt>
                <dd className="font-medium text-stone-800">
                  {formatValue(override.valueJson.oldValue, override.valueJson.currency)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-stone-500">{locale === 'ru' ? 'Стало' : 'New Value'}</dt>
              <dd className="font-medium text-stone-800">
                {formatValue(override.valueJson.newValue, override.valueJson.currency)}
              </dd>
            </div>
            {override.valueJson.adjustmentAmount !== undefined && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Корректировка' : 'Adjustment'}</dt>
                <dd className={`font-medium ${override.valueJson.adjustmentAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {override.valueJson.adjustmentAmount >= 0 ? '+' : ''}
                  {formatValue(override.valueJson.adjustmentAmount, override.valueJson.currency)}
                </dd>
              </div>
            )}
            {override.valueJson.field && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Поле' : 'Field'}</dt>
                <dd className="font-medium text-stone-800">{override.valueJson.field}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Workflow Details */}
        <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
          <h3 className="font-medium text-stone-800 mb-3">
            {locale === 'ru' ? 'Workflow' : 'Workflow'}
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">{locale === 'ru' ? 'Запросил' : 'Requested By'}</dt>
              <dd className="font-medium text-stone-800">
                {override.requestedByName || override.requestedByUserId}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">{locale === 'ru' ? 'Создано' : 'Created'}</dt>
              <dd className="font-medium text-stone-800">{formatDate(override.createdAt)}</dd>
            </div>
            {override.approvedByUserId && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Одобрил' : 'Approved By'}</dt>
                <dd className="font-medium text-stone-800">
                  {override.approvedByName || override.approvedByUserId}
                </dd>
              </div>
            )}
            {override.appliedAt && (
              <div className="flex justify-between">
                <dt className="text-stone-500">{locale === 'ru' ? 'Применено' : 'Applied'}</dt>
                <dd className="font-medium text-stone-800">{formatDate(override.appliedAt)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Reason */}
      <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
        <h3 className="font-medium text-stone-800 mb-2">
          {locale === 'ru' ? 'Причина' : 'Reason'}
        </h3>
        <p className="text-sm text-stone-600">{override.reason}</p>
      </div>

      {/* Rejection Reason */}
      {override.statusKey === 'rejected' && override.rejectionReason && (
        <div className="p-4 rounded-lg bg-red-50/50 border border-red-200/50">
          <h3 className="font-medium text-red-800 mb-2">
            {locale === 'ru' ? 'Причина отклонения' : 'Rejection Reason'}
          </h3>
          <p className="text-sm text-red-600">{override.rejectionReason}</p>
        </div>
      )}

      {/* Actions */}
      {transitions.length > 0 && (
        <div className="flex gap-3 pt-4 border-t border-stone-200">
          {override.statusKey === 'draft' && onSubmit && (
            <button
              onClick={onSubmit}
              className="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              {locale === 'ru' ? 'Отправить на согласование' : 'Submit for Approval'}
            </button>
          )}
          {override.statusKey === 'pending' && onApprove && (
            <button
              onClick={onApprove}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {locale === 'ru' ? 'Одобрить' : 'Approve'}
            </button>
          )}
          {override.statusKey === 'pending' && onReject && (
            <button
              onClick={() => {
                const reason = prompt(locale === 'ru' ? 'Причина отклонения:' : 'Rejection reason:');
                if (reason) onReject(reason);
              }}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {locale === 'ru' ? 'Отклонить' : 'Reject'}
            </button>
          )}
          {override.statusKey === 'approved' && onApply && (
            <button
              onClick={onApply}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {locale === 'ru' ? 'Применить' : 'Apply'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

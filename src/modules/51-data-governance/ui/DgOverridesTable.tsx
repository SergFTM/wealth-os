'use client';

import React from 'react';
import Link from 'next/link';
import { DataOverride } from '../engine/types';
import { OVERRIDE_TYPES, OVERRIDE_STATUSES } from '../config';

interface DgOverridesTableProps {
  overrides: DataOverride[];
  onRowClick?: (id: string) => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgOverridesTable({ overrides, onRowClick, locale = 'ru' }: DgOverridesTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
    draft: 'bg-stone-100 text-stone-600',
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    applied: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white/80 backdrop-blur-sm">
      <table className="min-w-full divide-y divide-stone-200/50">
        <thead className="bg-stone-50/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Цель' : 'Target'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Тип' : 'Type'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Значение' : 'Value'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Причина' : 'Reason'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Запросил' : 'Requested By'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Статус' : 'Status'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Дата' : 'Date'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {overrides.map((override) => (
            <tr
              key={override.id}
              onClick={() => onRowClick?.(override.id)}
              className="hover:bg-stone-50/50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/m/governance-data/override/${override.id}`}
                  className="font-medium text-stone-900 hover:text-emerald-600"
                >
                  {override.targetName || override.targetId}
                </Link>
                <p className="text-xs text-stone-500">{override.targetTypeKey}</p>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">
                  {OVERRIDE_TYPES[override.overrideTypeKey]?.[locale] || override.overrideTypeKey}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {override.valueJson.adjustmentAmount !== undefined ? (
                  <span className={override.valueJson.adjustmentAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {override.valueJson.adjustmentAmount >= 0 ? '+' : ''}
                    {formatValue(override.valueJson.adjustmentAmount, override.valueJson.currency)}
                  </span>
                ) : (
                  <span className="text-stone-600">
                    {override.valueJson.oldValue} → {override.valueJson.newValue}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600 max-w-xs truncate">
                {override.reason}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {override.requestedByName || override.requestedByUserId}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColorMap[override.statusKey]}`}>
                  {OVERRIDE_STATUSES[override.statusKey]?.[locale] || override.statusKey}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatDate(override.createdAt)}
              </td>
            </tr>
          ))}
          {overrides.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                {locale === 'ru' ? 'Нет overrides' : 'No overrides'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

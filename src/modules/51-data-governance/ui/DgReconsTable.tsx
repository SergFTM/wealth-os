'use client';

import React from 'react';
import Link from 'next/link';
import { DataReconciliation } from '../engine/types';
import { DgStatusPill } from './DgStatusPill';
import { RECON_TYPES } from '../config';

interface DgReconsTableProps {
  recons: DataReconciliation[];
  onRowClick?: (id: string) => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgReconsTable({ recons, onRowClick, locale = 'ru' }: DgReconsTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number, currency?: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: currency ? 'currency' : 'decimal',
      currency: currency || undefined,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white/80 backdrop-blur-sm">
      <table className="min-w-full divide-y divide-stone-200/50">
        <thead className="bg-stone-50/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Тип сверки' : 'Recon Type'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Название' : 'Name'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              As-of
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Левый источник' : 'Left Source'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Правый источник' : 'Right Source'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Дельта' : 'Delta'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Статус' : 'Status'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {recons.map((recon) => (
            <tr
              key={recon.id}
              onClick={() => onRowClick?.(recon.id)}
              className="hover:bg-stone-50/50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                  {RECON_TYPES[recon.reconTypeKey]?.[locale] || recon.reconTypeKey}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/m/governance-data/recon/${recon.id}`}
                  className="font-medium text-stone-900 hover:text-emerald-600"
                >
                  {recon.name || `${RECON_TYPES[recon.reconTypeKey]?.en} - ${formatDate(recon.asOf)}`}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatDate(recon.asOf)}
              </td>
              <td className="px-4 py-3">
                <div className="text-sm">
                  <div className="font-medium text-stone-900">{recon.leftSourceJson.name}</div>
                  <div className="text-stone-600">
                    {formatCurrency(recon.leftSourceJson.value, recon.leftSourceJson.currency)}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm">
                  <div className="font-medium text-stone-900">{recon.rightSourceJson.name}</div>
                  <div className="text-stone-600">
                    {formatCurrency(recon.rightSourceJson.value, recon.rightSourceJson.currency)}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className={`text-sm font-medium ${
                  recon.statusKey === 'break' ? 'text-red-600' : 'text-stone-600'
                }`}>
                  {formatCurrency(recon.deltaValueJson.amount, recon.deltaValueJson.currency)}
                  <span className="text-xs ml-1">
                    ({recon.deltaValueJson.percent.toFixed(2)}%)
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <DgStatusPill status={recon.statusKey} locale={locale} />
              </td>
            </tr>
          ))}
          {recons.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                {locale === 'ru' ? 'Нет данных о сверках' : 'No reconciliation data'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

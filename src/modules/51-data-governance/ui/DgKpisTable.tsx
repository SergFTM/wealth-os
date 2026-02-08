'use client';

import React from 'react';
import Link from 'next/link';
import { DataKpi } from '../engine/types';
import { DgTrustBadge } from './DgTrustBadge';
import { DgStatusPill } from './DgStatusPill';
import { KPI_DOMAINS } from '../config';

interface DgKpisTableProps {
  kpis: DataKpi[];
  qualityScores?: Record<string, number>;
  onRowClick?: (id: string) => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgKpisTable({ kpis, qualityScores = {}, onRowClick, locale = 'ru' }: DgKpisTableProps) {
  const formatValue = (kpi: DataKpi) => {
    if (!kpi.lastValueJson) return '—';
    const { value, currency } = kpi.lastValueJson;
    if (currency) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white/80 backdrop-blur-sm">
      <table className="min-w-full divide-y divide-stone-200/50">
        <thead className="bg-stone-50/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              KPI
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Домен' : 'Domain'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Значение' : 'Value'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              As-of
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              Trust
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              Quality
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Статус' : 'Status'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {kpis.map((kpi) => (
            <tr
              key={kpi.id}
              onClick={() => onRowClick?.(kpi.id)}
              className="hover:bg-stone-50/50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/m/governance-data/kpi/${kpi.id}`}
                  className="font-medium text-stone-900 hover:text-emerald-600"
                >
                  {kpi.name}
                </Link>
                <p className="text-xs text-stone-500 truncate max-w-xs">{kpi.description}</p>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {KPI_DOMAINS[kpi.domainKey]?.[locale] || kpi.domainKey}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-stone-900">
                {formatValue(kpi)}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatDate(kpi.asOf)}
              </td>
              <td className="px-4 py-3">
                <DgTrustBadge badge={kpi.trustBadgeKey} size="sm" locale={locale} />
              </td>
              <td className="px-4 py-3">
                {qualityScores[kpi.id] !== undefined ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          qualityScores[kpi.id] >= 80
                            ? 'bg-emerald-500'
                            : qualityScores[kpi.id] >= 60
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${qualityScores[kpi.id]}%` }}
                      />
                    </div>
                    <span className="text-xs text-stone-600">{qualityScores[kpi.id]}%</span>
                  </div>
                ) : (
                  <span className="text-xs text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <DgStatusPill status={kpi.status} locale={locale} />
              </td>
            </tr>
          ))}
          {kpis.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                {locale === 'ru' ? 'Нет данных' : 'No data'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

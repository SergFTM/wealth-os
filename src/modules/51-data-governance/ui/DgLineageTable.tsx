'use client';

import React from 'react';
import Link from 'next/link';
import { DataLineage } from '../engine/types';

interface DgLineageTableProps {
  lineages: DataLineage[];
  onRowClick?: (id: string) => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgLineageTable({ lineages, onRowClick, locale = 'ru' }: DgLineageTableProps) {
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
              {locale === 'ru' ? 'Входные коллекции' : 'Input Collections'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Поля' : 'Fields'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Этапы' : 'Steps'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Обновлено' : 'Updated'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {lineages.map((lineage) => {
            const collections = lineage.inputsJson.map(i => i.collection);
            const allFields = lineage.inputsJson.flatMap(i => i.fields);

            return (
              <tr
                key={lineage.id}
                onClick={() => onRowClick?.(lineage.id)}
                className="hover:bg-stone-50/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/m/governance-data/lineage/${lineage.id}`}
                    className="font-medium text-stone-900 hover:text-emerald-600"
                  >
                    {lineage.kpiName || lineage.kpiId}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {collections.slice(0, 3).map((col, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700"
                      >
                        {col}
                      </span>
                    ))}
                    {collections.length > 3 && (
                      <span className="text-xs text-stone-400">+{collections.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {allFields.slice(0, 4).join(', ')}
                  {allFields.length > 4 && ` +${allFields.length - 4}`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-stone-900">
                      {lineage.transformsJson.length}
                    </span>
                    {lineage.transformsJson.some(t => t.riskKey === 'high') && (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {formatDate(lineage.updatedAt)}
                </td>
              </tr>
            );
          })}
          {lineages.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                {locale === 'ru' ? 'Нет данных о lineage' : 'No lineage data'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import React from 'react';
import { RhTierBadge } from './RhTierBadge';
import { RhRolePill } from './RhRolePill';

export interface CoverageRow {
  id: string;
  scopeTypeKey: 'household' | 'person';
  scopeName: string;
  tierKey: 'A' | 'B' | 'C';
  primaryUserName: string;
  backupUserName?: string;
  specialists: Array<{ roleKey: string; userName: string }>;
  hasGaps: boolean;
  slaNotes?: string;
}

interface RhCoverageTableProps {
  coverages: CoverageRow[];
  onRowClick?: (coverage: CoverageRow) => void;
  onAssign?: (coverageId: string) => void;
  loading?: boolean;
}

export function RhCoverageTable({ coverages, onRowClick, onAssign, loading }: RhCoverageTableProps) {
  const getScopeIcon = (type: string) => {
    return type === 'household' ? '🏠' : '👤';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (coverages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">👥</span>
        <p>Нет данных о покрытии</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Объект
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Уровень
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Основной RM
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Резервный RM
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Специалисты
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coverages.map((coverage) => (
            <tr
              key={coverage.id}
              onClick={() => onRowClick?.(coverage)}
              className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''} transition-colors ${coverage.hasGaps ? 'bg-amber-50/50' : ''}`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{getScopeIcon(coverage.scopeTypeKey)}</span>
                  <span className="font-medium text-gray-900">{coverage.scopeName}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <RhTierBadge tier={coverage.tierKey} size="sm" />
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {coverage.primaryUserName || (
                  <span className="text-red-500 font-medium">Не назначен!</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {coverage.backupUserName || (
                  <span className={coverage.tierKey !== 'C' ? 'text-amber-500' : 'text-gray-400'}>
                    {coverage.tierKey !== 'C' ? 'Требуется' : '—'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {coverage.specialists.length > 0 ? (
                    coverage.specialists.slice(0, 3).map((s, i) => (
                      <RhRolePill key={i} role={s.roleKey} size="sm" />
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                  {coverage.specialists.length > 3 && (
                    <span className="text-xs text-gray-500">+{coverage.specialists.length - 3}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {coverage.hasGaps ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                    ⚠️ Gaps
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                    ✓ OK
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssign?.(coverage.id);
                  }}
                  className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Назначить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RhCoverageTable;

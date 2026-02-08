"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RhTierBadge } from './RhTierBadge';

export interface HouseholdRow {
  id: string;
  name: string;
  tierKey: 'A' | 'B' | 'C';
  primaryRmName?: string;
  membersCount: number;
  openInitiatives: number;
  clientSafePublished: boolean;
  lastInteractionDate?: string;
}

interface RhHouseholdsTableProps {
  households: HouseholdRow[];
  onRowClick?: (household: HouseholdRow) => void;
  loading?: boolean;
}

export function RhHouseholdsTable({ households, onRowClick, loading }: RhHouseholdsTableProps) {
  const router = useRouter();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleRowClick = (household: HouseholdRow) => {
    if (onRowClick) {
      onRowClick(household);
    } else {
      router.push(`/m/relationships/household/${household.id}`);
    }
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

  if (households.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">🏠</span>
        <p>Нет домохозяйств</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Уровень
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RM
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Участники
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Инициативы
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client-safe
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Посл. контакт
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {households.map((household) => (
            <tr
              key={household.id}
              onClick={() => handleRowClick(household)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{household.name}</p>
              </td>
              <td className="px-4 py-3">
                <RhTierBadge tier={household.tierKey} size="sm" />
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {household.primaryRmName || '—'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {household.membersCount}
              </td>
              <td className="px-4 py-3">
                {household.openInitiatives > 0 ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {household.openInitiatives}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {household.clientSafePublished ? (
                  <span className="text-emerald-600">✓</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(household.lastInteractionDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RhHouseholdsTable;

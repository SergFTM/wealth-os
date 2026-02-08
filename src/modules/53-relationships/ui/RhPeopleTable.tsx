"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RhRolePill } from './RhRolePill';
import { RhTierBadge } from './RhTierBadge';

export interface PersonRow {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roleKey?: string;
  tierKey?: string;
  rmOwnerName?: string;
  nextInteractionDate?: string;
  householdId?: string;
  householdName?: string;
}

interface RhPeopleTableProps {
  people: PersonRow[];
  onRowClick?: (person: PersonRow) => void;
  loading?: boolean;
}

export function RhPeopleTable({ people, onRowClick, loading }: RhPeopleTableProps) {
  const router = useRouter();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleRowClick = (person: PersonRow) => {
    if (onRowClick) {
      onRowClick(person);
    } else {
      router.push(`/m/relationships/person/${person.id}`);
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

  if (people.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">👥</span>
        <p>Нет данных о людях</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Имя
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Роль
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Уровень
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RM
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Домохозяйство
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              След. контакт
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {people.map((person) => (
            <tr
              key={person.id}
              onClick={() => handleRowClick(person)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{person.name}</p>
                  {person.email && (
                    <p className="text-xs text-gray-500">{person.email}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {person.roleKey ? (
                  <RhRolePill role={person.roleKey} size="sm" />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {person.tierKey ? (
                  <RhTierBadge tier={person.tierKey} size="sm" showLabel={false} />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {person.rmOwnerName || '—'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {person.householdName || '—'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(person.nextInteractionDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RhPeopleTable;

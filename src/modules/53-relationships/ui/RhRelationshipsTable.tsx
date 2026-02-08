"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RhRolePill } from './RhRolePill';

export interface RelationshipRow {
  id: string;
  fromName: string;
  fromType: string;
  toName: string;
  toType: string;
  relationshipTypeKey: string;
  roleLabel?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  hasEvidence: boolean;
}

interface RhRelationshipsTableProps {
  relationships: RelationshipRow[];
  onRowClick?: (relationship: RelationshipRow) => void;
  loading?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  family: 'Семья',
  role: 'Роль',
  authority: 'Доверенность',
  vendor_contact: 'Контакт вендора',
  ownership_link: 'Связь владения',
};

const ENTITY_TYPE_ICONS: Record<string, string> = {
  person: '👤',
  entity: '🏢',
  trust: '🏛️',
  household: '🏠',
};

export function RhRelationshipsTable({ relationships, onRowClick, loading }: RhRelationshipsTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleRowClick = (relationship: RelationshipRow) => {
    if (onRowClick) {
      onRowClick(relationship);
    } else {
      router.push(`/m/relationships/relationship/${relationship.id}`);
    }
  };

  const isActive = (rel: RelationshipRow) => {
    const now = new Date();
    const from = new Date(rel.effectiveFrom);
    const to = rel.effectiveTo ? new Date(rel.effectiveTo) : null;
    return from <= now && (!to || to >= now);
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

  if (relationships.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">🔗</span>
        <p>Нет связей</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              От кого
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              К кому
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Тип связи
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Роль
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действует
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Документы
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {relationships.map((rel) => (
            <tr
              key={rel.id}
              onClick={() => handleRowClick(rel)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{ENTITY_TYPE_ICONS[rel.fromType] || '•'}</span>
                  <span className="font-medium text-gray-900">{rel.fromName}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{ENTITY_TYPE_ICONS[rel.toType] || '•'}</span>
                  <span className="font-medium text-gray-900">{rel.toName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {TYPE_LABELS[rel.relationshipTypeKey] || rel.relationshipTypeKey}
              </td>
              <td className="px-4 py-3">
                {rel.roleLabel ? (
                  <RhRolePill role={rel.roleLabel} size="sm" />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(rel.effectiveFrom)}
                {rel.effectiveTo && ` — ${formatDate(rel.effectiveTo)}`}
              </td>
              <td className="px-4 py-3">
                {rel.hasEvidence ? (
                  <span className="text-emerald-600">📄 Есть</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {isActive(rel) ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Активно
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Истекло
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RhRelationshipsTable;

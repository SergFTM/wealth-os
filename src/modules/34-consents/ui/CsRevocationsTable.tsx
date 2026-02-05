"use client";

import React from 'react';
import { CsScopeBadge } from './CsScopeBadge';
import { Eye } from 'lucide-react';

interface Revocation {
  id: string;
  consentId: string;
  subjectName?: string;
  subjectType?: string;
  scopeType?: string;
  scopeName?: string;
  revokedByName?: string;
  reason: string;
  revokedAt: string;
}

interface CsRevocationsTableProps {
  revocations: Revocation[];
  onOpen?: (id: string) => void;
  compact?: boolean;
}

export function CsRevocationsTable({
  revocations,
  onOpen,
  compact = false,
}: CsRevocationsTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (revocations.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет отзывов
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50 bg-stone-50/50">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Consent ID</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Субъект</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Scope</th>}
            <th className="text-left py-3 px-4 font-medium text-stone-600">Отозвал</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Причина</th>}
            <th className="text-left py-3 px-4 font-medium text-stone-600">Дата</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {revocations.map((rev) => (
            <tr
              key={rev.id}
              className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer"
              onClick={() => onOpen?.(rev.id)}
            >
              <td className="py-3 px-4">
                <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                  {rev.consentId.substring(0, 12)}...
                </code>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium text-stone-800">{rev.subjectName || '—'}</div>
                <div className="text-xs text-stone-500">{rev.subjectType}</div>
              </td>
              {!compact && (
                <td className="py-3 px-4">
                  {rev.scopeType && (
                    <CsScopeBadge scopeType={rev.scopeType} scopeName={rev.scopeName} />
                  )}
                </td>
              )}
              <td className="py-3 px-4 text-stone-600">
                {rev.revokedByName || '—'}
              </td>
              {!compact && (
                <td className="py-3 px-4">
                  <div className="text-stone-600 truncate max-w-[200px]" title={rev.reason}>
                    {rev.reason}
                  </div>
                </td>
              )}
              <td className="py-3 px-4 text-stone-600 text-xs">
                {formatDate(rev.revokedAt)}
              </td>
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onOpen?.(rev.id)}
                  className="p-1 hover:bg-stone-100 rounded"
                >
                  <Eye className="w-4 h-4 text-stone-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

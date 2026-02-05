"use client";

import React from 'react';
import { CsStatusPill } from './CsStatusPill';
import { CsScopeBadge } from './CsScopeBadge';
import { MoreHorizontal, Eye, Calendar, XCircle } from 'lucide-react';

interface Consent {
  id: string;
  subjectName?: string;
  subjectType: string;
  scopeType: string;
  scopeName?: string;
  permissions: string[];
  status: string;
  validUntil?: string;
  clientSafe?: boolean;
}

interface CsConsentsTableProps {
  consents: Consent[];
  onOpen?: (id: string) => void;
  onExtend?: (id: string) => void;
  onRevoke?: (id: string) => void;
  compact?: boolean;
}

const subjectTypeLabels: Record<string, string> = {
  user: 'Пользователь',
  advisor: 'Advisor',
  client: 'Клиент',
};

export function CsConsentsTable({
  consents,
  onOpen,
  onExtend,
  onRevoke,
  compact = false,
}: CsConsentsTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  if (consents.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет согласий
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50 bg-stone-50/50">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Субъект</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Тип</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Scope</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Разрешения</th>}
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статус</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">До</th>}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {consents.map((consent) => (
            <tr
              key={consent.id}
              className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer"
              onClick={() => onOpen?.(consent.id)}
            >
              <td className="py-3 px-4">
                <div className="font-medium text-stone-800">{consent.subjectName || consent.id}</div>
              </td>
              <td className="py-3 px-4">
                <span className="text-xs text-stone-500">
                  {subjectTypeLabels[consent.subjectType] || consent.subjectType}
                </span>
              </td>
              <td className="py-3 px-4">
                <CsScopeBadge scopeType={consent.scopeType} scopeName={consent.scopeName} />
              </td>
              {!compact && (
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {consent.permissions.map((p) => (
                      <span
                        key={p}
                        className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-xs"
                      >
                        {p}
                      </span>
                    ))}
                    {consent.clientSafe && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                        client-safe
                      </span>
                    )}
                  </div>
                </td>
              )}
              <td className="py-3 px-4">
                <CsStatusPill status={consent.status} />
              </td>
              {!compact && (
                <td className="py-3 px-4 text-stone-600">
                  {formatDate(consent.validUntil)}
                </td>
              )}
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative group">
                  <button className="p-1 hover:bg-stone-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-stone-200 py-1 hidden group-hover:block z-10 min-w-[140px]">
                    <button
                      onClick={() => onOpen?.(consent.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Открыть
                    </button>
                    {consent.status === 'active' && (
                      <>
                        <button
                          onClick={() => onExtend?.(consent.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" /> Продлить
                        </button>
                        <button
                          onClick={() => onRevoke?.(consent.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Отозвать
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

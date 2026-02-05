"use client";

import React from 'react';
import { CsStatusPill } from './CsStatusPill';
import { CsScopeBadge } from './CsScopeBadge';
import { MoreHorizontal, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AccessRequest {
  id: string;
  requestedByName?: string;
  requestedBySubjectType: string;
  scopeType: string;
  scopeName?: string;
  permissions: string[];
  reason: string;
  status: string;
  slaDueAt?: string;
}

interface CsRequestsTableProps {
  requests: AccessRequest[];
  onOpen?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  compact?: boolean;
}

export function CsRequestsTable({
  requests,
  onOpen,
  onApprove,
  onReject,
  compact = false,
}: CsRequestsTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const isOverdue = (slaDueAt?: string) => {
    if (!slaDueAt) return false;
    return new Date(slaDueAt) < new Date();
  };

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет запросов
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50 bg-stone-50/50">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Запрошено</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Scope</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Разрешения</th>}
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Причина</th>}
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статус</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">SLA</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr
              key={req.id}
              className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer"
              onClick={() => onOpen?.(req.id)}
            >
              <td className="py-3 px-4">
                <div className="font-medium text-stone-800">{req.requestedByName || req.id}</div>
                <div className="text-xs text-stone-500">{req.requestedBySubjectType}</div>
              </td>
              <td className="py-3 px-4">
                <CsScopeBadge scopeType={req.scopeType} scopeName={req.scopeName} />
              </td>
              {!compact && (
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {req.permissions.map((p) => (
                      <span
                        key={p}
                        className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-xs"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
              )}
              {!compact && (
                <td className="py-3 px-4">
                  <div className="text-stone-600 truncate max-w-[200px]" title={req.reason}>
                    {req.reason}
                  </div>
                </td>
              )}
              <td className="py-3 px-4">
                <CsStatusPill status={req.status} />
              </td>
              <td className="py-3 px-4">
                <div className={`flex items-center gap-1 ${isOverdue(req.slaDueAt) && req.status === 'pending' ? 'text-rose-600' : 'text-stone-600'}`}>
                  {isOverdue(req.slaDueAt) && req.status === 'pending' && (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  {formatDate(req.slaDueAt)}
                </div>
              </td>
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative group">
                  <button className="p-1 hover:bg-stone-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-stone-200 py-1 hidden group-hover:block z-10 min-w-[140px]">
                    <button
                      onClick={() => onOpen?.(req.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Открыть
                    </button>
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove?.(req.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 text-emerald-600 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Одобрить
                        </button>
                        <button
                          onClick={() => onReject?.(req.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Отклонить
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

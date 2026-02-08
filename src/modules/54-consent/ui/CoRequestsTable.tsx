"use client";

import { MoreHorizontal, Eye } from 'lucide-react';
import { useState } from 'react';
import { CoStatusPill } from './CoStatusPill';

interface CoRequestsTableProps {
  requests: any[];
  onOpen: (id: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

const requestTypeLabels: Record<string, { label: string; className: string }> = {
  access: {
    label: 'Доступ',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  data_export: {
    label: 'Экспорт данных',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  deletion: {
    label: 'Удаление',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  correction: {
    label: 'Исправление',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  restriction: {
    label: 'Ограничение',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  },
};

export function CoRequestsTable({ requests, onOpen }: CoRequestsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет запросов
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Запросивший</th>
            <th className="px-4 py-3 font-medium">Тип запроса</th>
            <th className="px-4 py-3 font-medium">Scope</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium">Срок</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {requests.map((request) => {
            const typeConfig = requestTypeLabels[request.requestType] || requestTypeLabels.access || {
              label: request.requestType,
              className: 'bg-stone-100 text-stone-600 border-stone-200',
            };

            return (
              <tr
                key={request.id}
                className="hover:bg-stone-50/50 cursor-pointer transition-colors"
                onClick={() => onOpen(request.id)}
              >
                <td className="px-4 py-3 text-sm text-stone-800 font-medium truncate max-w-[180px]">
                  {request.requesterName || request.requester}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${typeConfig.className}`}
                  >
                    {typeConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600 truncate max-w-[200px]">
                  {request.scopeDescription || request.scope || '-'}
                </td>
                <td className="px-4 py-3">
                  <CoStatusPill status={request.status} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {request.deadline ? formatDate(request.deadline) : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === request.id ? null : request.id);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-stone-400" />
                    </button>
                    {menuOpen === request.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen(request.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Подробнее
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

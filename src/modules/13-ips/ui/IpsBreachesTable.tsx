"use client";

import { AlertTriangle, MoreVertical, Eye, CheckCircle, Clock, UserPlus, FileWarning } from 'lucide-react';
import { useState } from 'react';

interface Breach {
  id: string;
  policyId: string;
  constraintId: string;
  detectedAt: string;
  measuredValue: number;
  limitValue: number;
  severity: 'ok' | 'warning' | 'critical';
  status: 'open' | 'in_review' | 'resolved';
  sourceType: 'auto' | 'manual';
  explanation?: string;
  owner?: string;
  constraintType?: string;
  constraintSegment?: string;
}

interface IpsBreachesTableProps {
  breaches: Breach[];
  onOpen: (id: string) => void;
  onAssign?: (id: string) => void;
  onResolve?: (id: string) => void;
  onCreateWaiver?: (id: string) => void;
}

const severityLabels: Record<string, string> = {
  ok: 'OK',
  warning: 'Предупреждение',
  critical: 'Критический',
};

const severityColors: Record<string, string> = {
  ok: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
};

const severityIcons: Record<string, string> = {
  ok: 'text-emerald-500',
  warning: 'text-amber-500',
  critical: 'text-red-500',
};

const statusLabels: Record<string, string> = {
  open: 'Открыто',
  in_review: 'На рассмотрении',
  resolved: 'Решено',
};

const statusColors: Record<string, string> = {
  open: 'bg-red-100 text-red-700',
  in_review: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

const formatDeviation = (measured: number, limit: number) => {
  const deviation = ((measured - limit) / limit * 100).toFixed(1);
  return measured > limit ? `+${deviation}%` : `${deviation}%`;
};

export function IpsBreachesTable({
  breaches,
  onOpen,
  onAssign,
  onResolve,
  onCreateWaiver,
}: IpsBreachesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (breaches.length === 0) {
    return (
      <div className="p-8 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
        <p className="text-stone-500">Нет нарушений</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Дата
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Ограничение
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Значение
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Отклонение
            </th>
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Серьезность
            </th>
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Владелец
            </th>
            <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">

            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {breaches.map((breach) => (
            <tr
              key={breach.id}
              onClick={() => onOpen(breach.id)}
              className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${severityIcons[breach.severity]}`} />
                  <span className="text-sm text-stone-800">
                    {formatDate(breach.detectedAt)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-stone-800">
                  {breach.constraintType || 'Ограничение'}
                </div>
                {breach.constraintSegment && (
                  <div className="text-xs text-stone-500">{breach.constraintSegment}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-mono">
                  <span className="text-red-600 font-medium">{breach.measuredValue}%</span>
                  <span className="text-stone-400 mx-1">vs</span>
                  <span className="text-stone-600">{breach.limitValue}%</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-mono text-red-600">
                  {formatDeviation(breach.measuredValue, breach.limitValue)}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${severityColors[breach.severity]}`}>
                  {severityLabels[breach.severity]}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[breach.status]}`}>
                  {statusLabels[breach.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {breach.owner || '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === breach.id ? null : breach.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-stone-400" />
                  </button>

                  {openMenuId === breach.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(breach.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          <Eye className="w-4 h-4" />
                          Открыть
                        </button>
                        {onAssign && breach.status !== 'resolved' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssign(breach.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            <UserPlus className="w-4 h-4" />
                            Назначить
                          </button>
                        )}
                        {onCreateWaiver && breach.status !== 'resolved' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreateWaiver(breach.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
                          >
                            <FileWarning className="w-4 h-4" />
                            Создать waiver
                          </button>
                        )}
                        {onResolve && breach.status !== 'resolved' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onResolve(breach.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Решить
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

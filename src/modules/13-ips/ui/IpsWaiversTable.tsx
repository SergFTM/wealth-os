"use client";

import { FileWarning, MoreVertical, Eye, CheckCircle, XCircle, Clock, Ban } from 'lucide-react';
import { useState } from 'react';

interface Waiver {
  id: string;
  policyId: string;
  constraintId?: string;
  breachId?: string;
  reason: string;
  startDate: string;
  endDate: string;
  allowedDeviation?: string;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  constraintType?: string;
}

interface IpsWaiversTableProps {
  waivers: Waiver[];
  onOpen: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRevoke?: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  active: 'Активен',
  expired: 'Истёк',
  revoked: 'Отозван',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-stone-100 text-stone-500',
  revoked: 'bg-red-100 text-red-700',
};

const approvalLabels: Record<string, string> = {
  pending: 'На согласовании',
  approved: 'Одобрен',
  rejected: 'Отклонён',
};

const approvalColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function IpsWaiversTable({
  waivers,
  onOpen,
  onApprove,
  onReject,
  onRevoke,
}: IpsWaiversTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (waivers.length === 0) {
    return (
      <div className="p-8 text-center">
        <FileWarning className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500">Нет исключений</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Ограничение
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Причина
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Период
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Отклонение
            </th>
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Согласование
            </th>
            <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">

            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {waivers.map((waiver) => {
            const daysRemaining = getDaysRemaining(waiver.endDate);
            const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 14;

            return (
              <tr
                key={waiver.id}
                onClick={() => onOpen(waiver.id)}
                className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileWarning className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-stone-800">
                      {waiver.constraintType || 'Ограничение'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-600 line-clamp-1 max-w-[200px]">
                    {waiver.reason}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-stone-600">
                    {formatDate(waiver.startDate)} — {formatDate(waiver.endDate)}
                  </div>
                  {waiver.status === 'active' && isExpiringSoon && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {daysRemaining} дн. осталось
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-stone-600">
                  {waiver.allowedDeviation || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[waiver.status]}`}>
                    {statusLabels[waiver.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${approvalColors[waiver.approvalStatus]}`}>
                    {approvalLabels[waiver.approvalStatus]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === waiver.id ? null : waiver.id);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-stone-400" />
                    </button>

                    {openMenuId === waiver.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen(waiver.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            <Eye className="w-4 h-4" />
                            Открыть
                          </button>
                          {onApprove && waiver.approvalStatus === 'pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onApprove(waiver.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Одобрить
                            </button>
                          )}
                          {onReject && waiver.approvalStatus === 'pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onReject(waiver.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                              Отклонить
                            </button>
                          )}
                          {onRevoke && waiver.status === 'active' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRevoke(waiver.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                            >
                              <Ban className="w-4 h-4" />
                              Отозвать
                            </button>
                          )}
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

"use client";

import { Package, Lock, Share2, FileEdit, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface EvidencePack {
  id: string;
  name: string;
  scopeType: string;
  periodStart: string | null;
  periodEnd: string | null;
  status: 'draft' | 'locked' | 'shared';
  documentIds: string[];
  createdAt: string;
  createdBy: string;
}

interface DvEvidencePacksTableProps {
  packs: EvidencePack[];
  onOpen: (id: string) => void;
  onLock?: (id: string) => void;
  onShare?: (id: string) => void;
  compact?: boolean;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'bg-stone-100 text-stone-600', icon: FileEdit },
  locked: { label: 'Заблокирован', color: 'bg-amber-100 text-amber-700', icon: Lock },
  shared: { label: 'Расшарен', color: 'bg-emerald-100 text-emerald-700', icon: Share2 },
};

const scopeLabels: Record<string, string> = {
  period: 'Период',
  entity: 'Юрлицо',
  fund: 'Фонд',
  audit: 'Аудит',
  kyc: 'KYC',
  custom: 'Произвольный',
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export function DvEvidencePacksTable({
  packs,
  onOpen,
  onLock,
  onShare,
  compact = false,
}: DvEvidencePacksTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (packs.length === 0) {
    return (
      <div className="p-8 text-center">
        <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500">Нет пакетов доказательств</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Пакет
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Охват
            </th>
            {!compact && (
              <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
                Период
              </th>
            )}
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Документы
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {packs.map((pack) => {
            const StatusIcon = statusConfig[pack.status].icon;
            return (
              <tr
                key={pack.id}
                onClick={() => onOpen(pack.id)}
                className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-stone-800 truncate max-w-[180px]">
                      {pack.name}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-600">
                    {scopeLabels[pack.scopeType] || pack.scopeType}
                  </span>
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-sm text-stone-600">
                    {pack.periodStart && pack.periodEnd
                      ? `${formatDate(pack.periodStart)} — ${formatDate(pack.periodEnd)}`
                      : '—'
                    }
                  </td>
                )}
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-sm text-stone-600">
                    {pack.documentIds.length}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
                    ${statusConfig[pack.status].color}
                  `}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[pack.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === pack.id ? null : pack.id);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-stone-400" />
                    </button>

                    {openMenuId === pack.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-20">
                          {pack.status === 'draft' && onLock && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLock(pack.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                            >
                              <Lock className="w-4 h-4" />
                              Заблокировать
                            </button>
                          )}
                          {pack.status !== 'draft' && onShare && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onShare(pack.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                            >
                              <Share2 className="w-4 h-4" />
                              Поделиться
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

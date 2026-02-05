"use client";

import { FileText, Lock, Send, CheckCircle, ExternalLink, Calendar, Flag } from 'lucide-react';

interface PackDocument {
  documentId: string;
  name: string;
  type: string;
  addedAt: string;
}

interface AdvisorPack {
  id: string;
  profileId: string;
  title: string;
  year: number;
  jurisdiction: string;
  status: 'draft' | 'locked' | 'shared' | 'completed';
  createdBy: string;
  advisorEmail: string | null;
  advisorName: string | null;
  documents: PackDocument[];
  notes: string | null;
  sharedAt: string | null;
  expiresAt: string | null;
  lockedAt: string | null;
  createdAt: string;
}

interface TxAdvisorPacksTableProps {
  packs: AdvisorPack[];
  onRowClick?: (pack: AdvisorPack) => void;
  onCreateNew?: () => void;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', icon: FileText },
  locked: { label: 'Заблокирован', color: 'text-amber-600', bg: 'bg-amber-100', icon: Lock },
  shared: { label: 'Отправлен', color: 'text-blue-600', bg: 'bg-blue-100', icon: Send },
  completed: { label: 'Завершён', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle },
};

const jurisdictionLabels: Record<string, string> = {
  RU: '🇷🇺 Россия',
  US: '🇺🇸 США',
  GB: '🇬🇧 Великобритания',
  AE: '🇦🇪 ОАЭ',
  CH: '🇨🇭 Швейцария',
  SG: '🇸🇬 Сингапур',
  CY: '🇨🇾 Кипр',
};

export function TxAdvisorPacksTable({ packs, onRowClick, onCreateNew }: TxAdvisorPacksTableProps) {
  const sortedPacks = [...packs].sort((a, b) => {
    const statusOrder = { draft: 0, locked: 1, shared: 2, completed: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Пакет</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Год</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Юрисдикция</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Документы</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Консультант</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Дата</th>
            </tr>
          </thead>
          <tbody>
            {sortedPacks.map((pack) => {
              const status = statusConfig[pack.status];
              const StatusIcon = status.icon;

              return (
                <tr
                  key={pack.id}
                  onClick={() => onRowClick?.(pack)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 text-stone-400" />
                      <div>
                        <div className="font-semibold text-stone-800">{pack.title}</div>
                        <div className="text-xs text-stone-500">Создал: {pack.createdBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-stone-700">{pack.year}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm">{jurisdictionLabels[pack.jurisdiction] || pack.jurisdiction}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-stone-100 text-stone-600 rounded-full text-xs font-medium">
                      {pack.documents.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {pack.advisorName ? (
                      <div>
                        <div className="font-medium text-stone-700">{pack.advisorName}</div>
                        <div className="text-xs text-stone-500">{pack.advisorEmail}</div>
                      </div>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-stone-700">
                      {new Date(pack.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                    {pack.sharedAt && (
                      <div className="text-xs text-blue-500 flex items-center justify-end gap-1">
                        <Send className="w-3 h-3" />
                        {new Date(pack.sharedAt).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedPacks.length === 0 && (
        <div className="p-8 text-center">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <div className="text-stone-500 mb-4">Нет пакетов для консультанта</div>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Создать первый пакет
            </button>
          )}
        </div>
      )}
    </div>
  );
}

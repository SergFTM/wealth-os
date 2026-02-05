"use client";

import { Edit3, Send, CheckCircle, Archive, ExternalLink, MoreHorizontal } from 'lucide-react';

interface Draft {
  id: string;
  clientId: string;
  draftType: string;
  title: string;
  contentText: string;
  status: 'draft' | 'reviewed' | 'sent' | 'archived';
  targetModule: string | null;
  createdAt: string;
}

interface AiDraftsTableProps {
  drafts: Draft[];
  onRowClick?: (draft: Draft) => void;
  onMarkReviewed?: (draft: Draft) => void;
  onSendToComms?: (draft: Draft) => void;
  onExport?: (draft: Draft) => void;
  compact?: boolean;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  message: { label: 'Сообщение', color: 'text-blue-600 bg-blue-50' },
  committee_pack: { label: 'Committee Pack', color: 'text-purple-600 bg-purple-50' },
  policy_summary: { label: 'Policy Summary', color: 'text-emerald-600 bg-emerald-50' },
  report_section: { label: 'Report Section', color: 'text-amber-600 bg-amber-50' },
  client_update: { label: 'Client Update', color: 'text-indigo-600 bg-indigo-50' },
  email: { label: 'Email', color: 'text-stone-600 bg-stone-100' },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-amber-600 bg-amber-50' },
  reviewed: { label: 'Reviewed', color: 'text-blue-600 bg-blue-50' },
  sent: { label: 'Sent', color: 'text-emerald-600 bg-emerald-50' },
  archived: { label: 'Archived', color: 'text-stone-500 bg-stone-100' },
};

const targetLabels: Record<string, string> = {
  comms: 'Comms',
  reporting: 'Reporting',
  ips: 'IPS',
  workflow: 'Workflow',
};

export function AiDraftsTable({
  drafts,
  onRowClick,
  onMarkReviewed,
  onSendToComms,
  onExport,
  compact = false,
}: AiDraftsTableProps) {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const displayDrafts = compact ? drafts.slice(0, 6) : drafts;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Тип
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Заголовок
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Статус
              </th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                  Target
                </th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Создан
              </th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayDrafts.map((draft) => {
              const type = typeLabels[draft.draftType] || {
                label: draft.draftType,
                color: 'text-stone-600 bg-stone-100',
              };
              const status = statusLabels[draft.status] || statusLabels.draft;

              return (
                <tr
                  key={draft.id}
                  onClick={() => onRowClick?.(draft)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${type.color}`}
                    >
                      {type.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-stone-800 font-medium truncate max-w-xs">
                        {draft.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-center text-stone-600 text-xs">
                      {draft.targetModule
                        ? targetLabels[draft.targetModule] || draft.targetModule
                        : '—'}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center text-stone-600 text-xs">
                    {formatDate(draft.createdAt)}
                  </td>
                  {!compact && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {draft.status === 'draft' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkReviewed?.(draft);
                            }}
                            className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Отметить reviewed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(draft.status === 'draft' || draft.status === 'reviewed') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSendToComms?.(draft);
                            }}
                            className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Отправить в Comms"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {drafts.length === 0 && (
        <div className="p-8 text-center text-stone-500">Нет drafts для отображения</div>
      )}
    </div>
  );
}

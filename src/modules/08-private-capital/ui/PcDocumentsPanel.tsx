"use client";

import { cn } from '@/lib/utils';

interface PcDocument {
  id: string;
  name: string;
  type: string;
  quarter?: string;
  fundId?: string;
  fundName?: string;
  isShared: boolean;
  status: string;
  createdAt: string;
}

interface PcDocumentsPanelProps {
  documents: PcDocument[];
  onOpen?: (id: string) => void;
  onUpload?: () => void;
  onShare?: (id: string) => void;
  compact?: boolean;
}

export function PcDocumentsPanel({ documents, onOpen, onUpload, onShare, compact }: PcDocumentsPanelProps) {
  const typeLabels: Record<string, string> = {
    call_notice: 'Call Notice',
    statement: 'Statement',
    quarterly_report: 'Q Report',
    capital_account: 'Capital Account'
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ru-RU');

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Документы</h3>
          {!compact && <p className="text-xs text-stone-500 mt-1">Quarterly reports, statements, notices</p>}
        </div>
        {onUpload && (
          <button
            onClick={onUpload}
            className="px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
          >
            + Загрузить
          </button>
        )}
      </div>
      <div className="divide-y divide-stone-100">
        {documents.length > 0 ? documents.slice(0, compact ? 5 : undefined).map(doc => (
          <div
            key={doc.id}
            onClick={() => onOpen?.(doc.id)}
            className="p-3 hover:bg-stone-50 cursor-pointer transition-colors flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg">📄</span>
              <div className="min-w-0">
                <div className="font-medium text-sm text-stone-800 truncate">{doc.name}</div>
                <div className="text-xs text-stone-500 flex gap-2">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded",
                    doc.type === 'quarterly_report' && "bg-blue-100 text-blue-600",
                    doc.type === 'statement' && "bg-emerald-100 text-emerald-600",
                    doc.type === 'call_notice' && "bg-amber-100 text-amber-600"
                  )}>
                    {typeLabels[doc.type] || doc.type}
                  </span>
                  {doc.quarter && <span>{doc.quarter}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {doc.status === 'missing' && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-700">Нет</span>
              )}
              {doc.isShared ? (
                <span className="text-emerald-500" title="Shared with client">👥</span>
              ) : (
                onShare && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onShare(doc.id); }}
                    className="text-xs text-stone-400 hover:text-stone-600"
                    title="Share"
                  >
                    🔗
                  </button>
                )
              )}
              <span className="text-xs text-stone-400">{formatDate(doc.createdAt)}</span>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-stone-500">
            <div className="text-2xl mb-2">📁</div>
            <p>Нет документов</p>
          </div>
        )}
      </div>
      {compact && documents.length > 5 && (
        <div className="p-3 border-t border-stone-100 text-center">
          <button className="text-xs text-emerald-600 hover:text-emerald-700">
            Показать все ({documents.length})
          </button>
        </div>
      )}
    </div>
  );
}

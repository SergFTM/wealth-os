"use client";

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  linkedTo: string;
  isShared: boolean;
}

interface PsDocumentsTableProps {
  documents: Document[];
  linkedToName?: string;
  onOpen?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDetach?: (id: string) => void;
  onAttach?: () => void;
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  agreement: 'Соглашение', cap_table: 'Cap Table', receipt: 'Квитанция',
  confirmation: 'Подтверждение', form: 'Форма', statement: 'Выписка', notice: 'Уведомление'
};

const typeColors: Record<string, string> = {
  agreement: 'bg-blue-100 text-blue-700', cap_table: 'bg-purple-100 text-purple-700',
  receipt: 'bg-emerald-100 text-emerald-700', confirmation: 'bg-amber-100 text-amber-700',
  form: 'bg-stone-100 text-stone-600', statement: 'bg-teal-100 text-teal-700',
  notice: 'bg-rose-100 text-rose-700'
};

export function PsDocumentsTable({ documents, linkedToName, onOpen, onDownload, onDetach, onAttach, compact }: PsDocumentsTableProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Документы</h3>
          {linkedToName && <p className="text-xs text-stone-500">{linkedToName}</p>}
        </div>
        {onAttach && <Button variant="secondary" size="sm" onClick={onAttach}>+ Прикрепить</Button>}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Документ</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Публичный</th>
            {!compact && <th className="py-3 px-4"></th>}
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id} onClick={() => onOpen?.(doc.id)} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium text-stone-800">{doc.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={cn("px-2 py-0.5 rounded text-xs", typeColors[doc.type] || 'bg-stone-100 text-stone-600')}>
                  {typeLabels[doc.type] || doc.type}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                {doc.isShared ? (
                  <span className="text-emerald-600">✓</span>
                ) : (
                  <span className="text-stone-300">—</span>
                )}
              </td>
              {!compact && (
                <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => onDownload?.(doc.id)}>⬇</Button>
                  <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => onDetach?.(doc.id)}>✕</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {documents.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-stone-500 mb-2">Нет прикрепленных документов</p>
          {onAttach && <Button variant="secondary" size="sm" onClick={onAttach}>Прикрепить документ</Button>}
        </div>
      )}
    </div>
  );
}

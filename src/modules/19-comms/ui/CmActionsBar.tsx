"use client";

import Link from 'next/link';
import { Plus, MessageSquare, CheckCircle, UserPlus, Archive, Download } from 'lucide-react';

interface CmActionsBarProps {
  onCreateThread?: () => void;
  onCreateRequest?: () => void;
  onCreateApproval?: () => void;
  onAddParticipants?: () => void;
  onArchiveSelected?: () => void;
  onExport?: () => void;
  selectedCount?: number;
}

export function CmActionsBar({
  onCreateThread,
  onCreateRequest,
  onCreateApproval,
  onAddParticipants,
  onArchiveSelected,
  onExport,
  selectedCount = 0,
}: CmActionsBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        href="/m/comms/new"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-lg shadow-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        Новый тред
      </Link>

      <Link
        href="/m/comms/new?type=request"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Новый запрос
      </Link>

      <Link
        href="/m/comms/new?type=approval"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        Тред для approval
      </Link>

      <div className="h-6 w-px bg-stone-200 mx-2" />

      <button
        onClick={onAddParticipants}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Добавить участников
      </button>

      {selectedCount > 0 && (
        <button
          onClick={onArchiveSelected}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <Archive className="w-4 h-4" />
          Архивировать ({selectedCount})
        </button>
      )}

      <button
        onClick={onExport}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        Экспорт
      </button>
    </div>
  );
}

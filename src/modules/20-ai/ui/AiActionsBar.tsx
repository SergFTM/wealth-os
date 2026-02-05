"use client";

import Link from 'next/link';
import { Sparkles, FileText, Edit3, ListTodo, History, Download } from 'lucide-react';

interface AiActionsBarProps {
  onAskCopilot?: () => void;
  onCreateNarrative?: () => void;
  onCreateDraft?: () => void;
  onRunTriage?: () => void;
}

export function AiActionsBar({
  onAskCopilot,
  onCreateNarrative,
  onCreateDraft,
  onRunTriage,
}: AiActionsBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onAskCopilot}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg shadow-sm transition-all"
      >
        <Sparkles className="w-4 h-4" />
        Спросить Copilot
      </button>

      <button
        onClick={onCreateNarrative}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
      >
        <FileText className="w-4 h-4" />
        Создать narrative
      </button>

      <button
        onClick={onCreateDraft}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
      >
        <Edit3 className="w-4 h-4" />
        Создать draft
      </button>

      <div className="h-6 w-px bg-stone-200 mx-2" />

      <button
        onClick={onRunTriage}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
      >
        <ListTodo className="w-4 h-4" />
        Запустить triage
      </button>

      <Link
        href="/m/ai/list?tab=audit"
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
      >
        <History className="w-4 h-4" />
        Audit trail
      </Link>

      <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors">
        <Download className="w-4 h-4" />
        Экспорт
      </button>
    </div>
  );
}

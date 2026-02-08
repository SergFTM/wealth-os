"use client";

import { Plus, Send, ShieldCheck, ClipboardCheck, Database } from 'lucide-react';

interface CoActionsBarProps {
  onCreateConsent: () => void;
  onCreateRequest: () => void;
  onCreatePolicy: () => void;
  onStartReview: () => void;
  onGenerateDemo: () => void;
}

export function CoActionsBar({
  onCreateConsent,
  onCreateRequest,
  onCreatePolicy,
  onStartReview,
  onGenerateDemo,
}: CoActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onCreateConsent}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Создать согласие</span>
      </button>

      <button
        onClick={onCreateRequest}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
      >
        <Send className="w-4 h-4" />
        <span className="text-sm font-medium">Новый запрос</span>
      </button>

      <button
        onClick={onCreatePolicy}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
      >
        <ShieldCheck className="w-4 h-4" />
        <span className="text-sm font-medium">Политика</span>
      </button>

      <button
        onClick={onStartReview}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
      >
        <ClipboardCheck className="w-4 h-4" />
        <span className="text-sm font-medium">Проверка доступа</span>
      </button>

      <button
        onClick={onGenerateDemo}
        className="flex items-center gap-2 px-3 py-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
      >
        <Database className="w-4 h-4" />
        <span className="text-sm">Demo</span>
      </button>
    </div>
  );
}

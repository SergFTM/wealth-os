'use client';

import React from 'react';
import {
  Plus,
  Play,
  FileText,
  Share2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ExActionsBarProps {
  onCreatePack: () => void;
  onRunExport: () => void;
  onCreateTemplate: () => void;
  onCreateShare: () => void;
  onGenerateDemo: () => void;
  loading?: boolean;
}

export function ExActionsBar({
  onCreatePack,
  onRunExport,
  onCreateTemplate,
  onCreateShare,
  onGenerateDemo,
  loading = false,
}: ExActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onCreatePack}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        Создать пакет
      </button>

      <button
        onClick={onRunExport}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        Запустить экспорт
      </button>

      <button
        onClick={onCreateTemplate}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        Создать шаблон
      </button>

      <button
        onClick={onCreateShare}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
      >
        <Share2 className="w-4 h-4" />
        Поделиться
      </button>

      <div className="flex-1" />

      <button
        onClick={onGenerateDemo}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 text-amber-700 rounded-lg font-medium hover:from-amber-200 hover:to-amber-100 transition-all disabled:opacity-50"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        Demo данные
      </button>
    </div>
  );
}

export default ExActionsBar;

"use client";

import { Upload, Package, Tags, Download, ClipboardList } from 'lucide-react';

interface DvActionsBarProps {
  onUpload: () => void;
  onCreatePack: () => void;
  onBulkTags: () => void;
  onExport: () => void;
  onCreateTask: () => void;
}

export function DvActionsBar({
  onUpload,
  onCreatePack,
  onBulkTags,
  onExport,
  onCreateTask,
}: DvActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onUpload}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-gradient-to-r from-emerald-500 to-emerald-600
          text-white text-sm font-medium
          hover:from-emerald-600 hover:to-emerald-700
          transition-all shadow-sm hover:shadow-md
        "
      >
        <Upload className="w-4 h-4" />
        Загрузить документ
      </button>

      <button
        onClick={onCreatePack}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white border border-stone-200 text-stone-700 text-sm font-medium
          hover:bg-stone-50 hover:border-stone-300
          transition-all
        "
      >
        <Package className="w-4 h-4" />
        Создать пакет
      </button>

      <button
        onClick={onBulkTags}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white border border-stone-200 text-stone-700 text-sm font-medium
          hover:bg-stone-50 hover:border-stone-300
          transition-all
        "
      >
        <Tags className="w-4 h-4" />
        Массовые теги
      </button>

      <button
        onClick={onExport}
        className="
          inline-flex items-center gap-2 px-3 py-2 rounded-lg
          text-stone-600 text-sm font-medium
          hover:bg-stone-100
          transition-all
        "
      >
        <Download className="w-4 h-4" />
        Экспорт CSV
      </button>

      <button
        onClick={onCreateTask}
        className="
          inline-flex items-center gap-2 px-3 py-2 rounded-lg
          text-stone-600 text-sm font-medium
          hover:bg-stone-100
          transition-all
        "
      >
        <ClipboardList className="w-4 h-4" />
        Создать задачу
      </button>
    </div>
  );
}

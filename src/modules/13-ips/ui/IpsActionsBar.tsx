"use client";

import { Plus, FileCheck, AlertTriangle, FileWarning, Users, Download, PlayCircle } from 'lucide-react';

interface IpsActionsBarProps {
  onCreatePolicy: () => void;
  onAddConstraint: () => void;
  onCreateWaiver: () => void;
  onScheduleMeeting: () => void;
  onCheckConstraints: () => void;
  onExport: () => void;
}

export function IpsActionsBar({
  onCreatePolicy,
  onAddConstraint,
  onCreateWaiver,
  onScheduleMeeting,
  onCheckConstraints,
  onExport,
}: IpsActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onCreatePolicy}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-gradient-to-r from-emerald-500 to-emerald-600
          text-white text-sm font-medium
          hover:from-emerald-600 hover:to-emerald-700
          transition-all shadow-sm hover:shadow-md
        "
      >
        <Plus className="w-4 h-4" />
        Новая политика
      </button>

      <button
        onClick={onAddConstraint}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white border border-stone-200 text-stone-700 text-sm font-medium
          hover:bg-stone-50 hover:border-stone-300
          transition-all
        "
      >
        <FileCheck className="w-4 h-4" />
        Добавить ограничение
      </button>

      <button
        onClick={onCreateWaiver}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white border border-stone-200 text-stone-700 text-sm font-medium
          hover:bg-stone-50 hover:border-stone-300
          transition-all
        "
      >
        <FileWarning className="w-4 h-4" />
        Создать waiver
      </button>

      <button
        onClick={onScheduleMeeting}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white border border-stone-200 text-stone-700 text-sm font-medium
          hover:bg-stone-50 hover:border-stone-300
          transition-all
        "
      >
        <Users className="w-4 h-4" />
        Заседание комитета
      </button>

      <button
        onClick={onCheckConstraints}
        className="
          inline-flex items-center gap-2 px-3 py-2 rounded-lg
          text-emerald-700 text-sm font-medium
          hover:bg-emerald-50
          transition-all
        "
      >
        <PlayCircle className="w-4 h-4" />
        Проверить ограничения
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
        Экспорт
      </button>
    </div>
  );
}

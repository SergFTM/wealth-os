"use client";

import { Button } from '@/components/ui/Button';

interface GlActionsBarProps {
  onCreateEntry?: () => void;
  onImportBank?: () => void;
  onAddFxRate?: () => void;
  onClosePeriod?: () => void;
  onExport?: () => void;
}

export function GlActionsBar({
  onCreateEntry,
  onImportBank,
  onAddFxRate,
  onClosePeriod,
  onExport
}: GlActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50">
      <Button variant="primary" onClick={onCreateEntry}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать проводку
      </Button>
      
      <Button variant="secondary" onClick={onImportBank}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Импорт банка
      </Button>
      
      <Button variant="secondary" onClick={onAddFxRate}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Добавить FX
      </Button>
      
      <Button variant="secondary" onClick={onClosePeriod}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Закрыть период
      </Button>
      
      <div className="flex-1" />
      
      <Button variant="ghost" onClick={onExport}>
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Экспорт
      </Button>
    </div>
  );
}

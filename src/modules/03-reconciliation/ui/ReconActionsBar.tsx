"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ReconActionsBarProps {
  onAddFeed?: () => void;
  onAddMapping?: () => void;
  onRunRecon?: () => void;
  onExportReport?: () => void;
  onCreateTask?: () => void;
  clientSafe?: boolean;
}

export function ReconActionsBar({
  onAddFeed,
  onAddMapping,
  onRunRecon,
  onExportReport,
  onCreateTask,
  clientSafe
}: ReconActionsBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Client-safe mode shows only export
  if (clientSafe) {
    return (
      <div className="flex items-center gap-2">
        {onExportReport && (
          <Button variant="secondary" size="sm" onClick={onExportReport}>
            Экспорт отчёта
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary action */}
      {onRunRecon && (
        <Button variant="primary" size="sm" onClick={onRunRecon}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Запустить сверку
        </Button>
      )}

      {/* Secondary actions dropdown */}
      <div className="relative">
        <Button variant="secondary" size="sm" onClick={() => setMenuOpen(!menuOpen)}>
          Ещё
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {menuOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20">
              {onAddFeed && (
                <button
                  onClick={() => { onAddFeed(); setMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить источник
                </button>
              )}
              {onAddMapping && (
                <button
                  onClick={() => { onAddMapping(); setMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  </svg>
                  Добавить маппинг
                </button>
              )}
              <div className="border-t border-stone-100 my-1" />
              {onExportReport && (
                <button
                  onClick={() => { onExportReport(); setMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Экспорт отчёта (CSV)
                </button>
              )}
              {onCreateTask && (
                <button
                  onClick={() => { onCreateTask(); setMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Создать задачу
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

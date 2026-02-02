"use client";

import { Button } from '@/components/ui/Button';

interface PerfActionsBarProps {
  onCreateView?: () => void;
  onAddBenchmark?: () => void;
  onImportFlows?: () => void;
  onExport?: () => void;
  onCreateTask?: () => void;
  clientSafe?: boolean;
}

export function PerfActionsBar({
  onCreateView,
  onAddBenchmark,
  onImportFlows,
  onExport,
  onCreateTask,
  clientSafe
}: PerfActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {!clientSafe && (
        <>
          <Button variant="primary" size="sm" onClick={onCreateView}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Создать отчёт
          </Button>
          <Button variant="secondary" size="sm" onClick={onAddBenchmark}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Добавить бенчмарк
          </Button>
          <Button variant="secondary" size="sm" onClick={onImportFlows}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Импорт flows
          </Button>
        </>
      )}
      <Button variant="ghost" size="sm" onClick={onExport}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Экспорт
      </Button>
      {!clientSafe && (
        <Button variant="ghost" size="sm" onClick={onCreateTask}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Создать задачу
        </Button>
      )}
    </div>
  );
}

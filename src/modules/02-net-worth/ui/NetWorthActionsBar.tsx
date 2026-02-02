"use client";

import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface NetWorthActionsBarProps {
  onAddHolding: () => void;
  onAddLiability: () => void;
  onAddValuation: () => void;
  onImport: () => void;
  onExport: () => void;
  onCreateReport: () => void;
  clientSafe?: boolean;
}

export function NetWorthActionsBar({
  onAddHolding,
  onAddLiability,
  onAddValuation,
  onImport,
  onExport,
  onCreateReport,
  clientSafe
}: NetWorthActionsBarProps) {
  const { locale } = useApp();

  if (clientSafe) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onExport}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {locale === 'ru' ? 'Экспорт' : 'Export'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" size="sm" onClick={onAddHolding}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {locale === 'ru' ? 'Добавить актив' : 'Add Holding'}
      </Button>
      
      <Button variant="secondary" size="sm" onClick={onAddLiability}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {locale === 'ru' ? 'Добавить обязательство' : 'Add Liability'}
      </Button>
      
      <Button variant="secondary" size="sm" onClick={onAddValuation}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        {locale === 'ru' ? 'Добавить оценку' : 'Add Valuation'}
      </Button>

      <div className="w-px h-6 bg-stone-300 mx-1" />

      <Button variant="ghost" size="sm" onClick={onImport}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {locale === 'ru' ? 'Импорт' : 'Import'}
      </Button>
      
      <Button variant="ghost" size="sm" onClick={onExport}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {locale === 'ru' ? 'Экспорт' : 'Export'}
      </Button>
      
      <Button variant="ghost" size="sm" onClick={onCreateReport}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {locale === 'ru' ? 'Отчёт' : 'Report'}
      </Button>
    </div>
  );
}

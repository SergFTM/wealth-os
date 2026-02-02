"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Section {
  id: string;
  type: string;
  title: string;
  description: string;
  order: number;
  visibility: 'internal' | 'client';
  status: 'ok' | 'stale' | 'missing';
  disclaimers: string[];
}

interface ReportsSectionsPanelProps {
  sections: Section[];
  onEdit?: (sectionId: string) => void;
  onDelete?: (sectionId: string) => void;
  onMoveUp?: (sectionId: string) => void;
  onMoveDown?: (sectionId: string) => void;
  onAddSource?: (sectionId: string) => void;
  onCreateTask?: (sectionId: string) => void;
  onAddSection?: () => void;
  readOnly?: boolean;
}

const typeLabels: Record<string, string> = {
  kpi_summary: 'KPI Summary',
  net_worth: 'Net Worth',
  performance: 'Performance',
  benchmark: 'Benchmark',
  risk: 'Risk',
  private_capital: 'Private Capital',
  liquidity: 'Liquidity',
  fees: 'Fees',
  tax: 'Tax',
  trust: 'Trust',
  custom: 'Custom',
};

const typeIcons: Record<string, string> = {
  kpi_summary: '📊',
  net_worth: '💰',
  performance: '📈',
  benchmark: '🎯',
  risk: '⚠️',
  private_capital: '🏦',
  liquidity: '💧',
  fees: '💳',
  tax: '🧾',
  trust: '🏛️',
  custom: '📄',
};

export function ReportsSectionsPanel({
  sections,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddSource,
  onCreateTask,
  onAddSection,
  readOnly = false
}: ReportsSectionsPanelProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Секции пакета</h3>
        {!readOnly && (
          <Button variant="primary" size="sm" onClick={onAddSection}>
            + Добавить секцию
          </Button>
        )}
      </div>
      
      <div className="divide-y divide-stone-100">
        {sortedSections.map((section, index) => (
          <div key={section.id} className="p-4 hover:bg-stone-50/50 transition-colors">
            <div className="flex items-start gap-3">
              {/* Order controls */}
              {!readOnly && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onMoveUp?.(section.id)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-stone-200 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onMoveDown?.(section.id)}
                    disabled={index === sortedSections.length - 1}
                    className="p-1 rounded hover:bg-stone-200 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Icon */}
              <span className="text-2xl">{typeIcons[section.type] || '📄'}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-stone-800">{section.title}</h4>
                  <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded">
                    {typeLabels[section.type]}
                  </span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    section.visibility === 'client' 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-stone-200 text-stone-600"
                  )}>
                    {section.visibility === 'client' ? 'Клиент' : 'Внутренний'}
                  </span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    section.status === 'ok' ? "bg-emerald-100 text-emerald-600" :
                    section.status === 'stale' ? "bg-amber-100 text-amber-600" :
                    "bg-rose-100 text-rose-600"
                  )}>
                    {section.status === 'ok' ? '✓ OK' : section.status === 'stale' ? '⏳ Устарел' : '❌ Missing'}
                  </span>
                </div>
                <p className="text-sm text-stone-500">{section.description}</p>
                {section.disclaimers.length > 0 && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    ⚠️ {section.disclaimers.join(' | ')}
                  </div>
                )}
              </div>

              {/* Actions */}
              {!readOnly && (
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit?.(section.id)}
                    className="p-2 rounded hover:bg-stone-200 text-stone-500"
                    title="Редактировать"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onAddSource?.(section.id)}
                    className="p-2 rounded hover:bg-stone-200 text-stone-500"
                    title="Добавить источник"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  {section.status !== 'ok' && (
                    <button
                      onClick={() => onCreateTask?.(section.id)}
                      className="p-2 rounded hover:bg-amber-100 text-amber-600"
                      title="Создать задачу"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onDelete?.(section.id)}
                    className="p-2 rounded hover:bg-rose-100 text-rose-500"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          <p className="mb-4">Нет секций. Добавьте из шаблона или вручную.</p>
          {!readOnly && (
            <Button variant="secondary" onClick={onAddSection}>
              + Добавить секцию
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

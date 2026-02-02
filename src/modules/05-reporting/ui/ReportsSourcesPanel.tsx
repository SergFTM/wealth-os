"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SourceItem {
  sectionId: string;
  sectionTitle: string;
  sourceRefs: Array<{ module: string; collection: string; asOf: string }>;
  status: 'ok' | 'stale' | 'missing';
  asOf: string;
}

interface ReportsSourcesPanelProps {
  sources: SourceItem[];
  onOpenSource?: (sectionId: string) => void;
  onCreateTask?: (sectionId: string) => void;
  onCreateAllTasks?: () => void;
  compact?: boolean;
}

const statusLabels: Record<string, string> = {
  ok: 'OK',
  stale: 'Устарел',
  missing: 'Нет данных',
};

export function ReportsSourcesPanel({
  sources,
  onOpenSource,
  onCreateTask,
  onCreateAllTasks,
  compact = false
}: ReportsSourcesPanelProps) {
  const issues = sources.filter(s => s.status !== 'ok');
  
  if (compact) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-stone-800 text-sm">Источники данных</h3>
          {issues.length > 0 && (
            <span className={cn(
              "text-xs px-2 py-0.5 rounded",
              issues.some(i => i.status === 'missing') 
                ? "bg-rose-100 text-rose-700" 
                : "bg-amber-100 text-amber-700"
            )}>
              {issues.length} проблем
            </span>
          )}
        </div>
        
        {issues.length > 0 ? (
          <div className="space-y-2">
            {issues.slice(0, 3).map(item => (
              <div key={item.sectionId} className="flex items-center justify-between text-xs">
                <span className="text-stone-600 truncate">{item.sectionTitle}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded",
                  item.status === 'missing' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                )}>
                  {statusLabels[item.status]}
                </span>
              </div>
            ))}
            {issues.length > 3 && (
              <p className="text-xs text-stone-400">+{issues.length - 3} ещё</p>
            )}
            <Button variant="secondary" size="sm" className="w-full mt-2" onClick={onCreateAllTasks}>
              Создать задачи на missing данные
            </Button>
          </div>
        ) : (
          <p className="text-xs text-stone-500">Все источники актуальны ✓</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Источники и As-of</h3>
        {issues.length > 0 && (
          <Button variant="secondary" size="sm" onClick={onCreateAllTasks}>
            Создать задачи ({issues.length})
          </Button>
        )}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Секция</th>
            <th className="text-left py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Источники</th>
            <th className="text-center py-2 px-4 text-xs font-semibold text-stone-500 uppercase">As-of</th>
            <th className="text-center py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {sources.map(item => (
            <tr key={item.sectionId} className="border-b border-stone-100">
              <td className="py-2 px-4 font-medium text-stone-800">{item.sectionTitle}</td>
              <td className="py-2 px-4 text-stone-500 text-xs">
                {item.sourceRefs.length > 0 
                  ? item.sourceRefs.map(s => `${s.module}/${s.collection}`).join(', ')
                  : '—'}
              </td>
              <td className="py-2 px-4 text-center text-stone-600">
                {new Date(item.asOf).toLocaleDateString('ru-RU')}
              </td>
              <td className="py-2 px-4 text-center">
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  item.status === 'ok' ? "bg-emerald-100 text-emerald-700" :
                  item.status === 'stale' ? "bg-amber-100 text-amber-700" :
                  "bg-rose-100 text-rose-700"
                )}>
                  {statusLabels[item.status]}
                </span>
              </td>
              <td className="py-2 px-4 text-right">
                {item.status !== 'ok' && (
                  <Button variant="ghost" size="sm" onClick={() => onCreateTask?.(item.sectionId)}>
                    Создать задачу
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

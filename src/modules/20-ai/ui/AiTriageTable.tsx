"use client";

import { ListTodo, Plus, Check, X, AlertTriangle } from 'lucide-react';

interface TriageItem {
  id: string;
  clientId: string;
  category: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestedAction: string;
  status: 'open' | 'accepted' | 'dismissed' | 'completed';
  createdAt: string;
}

interface AiTriageTableProps {
  items: TriageItem[];
  onRowClick?: (item: TriageItem) => void;
  onCreateTask?: (item: TriageItem) => void;
  onAccept?: (item: TriageItem) => void;
  onDismiss?: (item: TriageItem) => void;
  compact?: boolean;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  sla: { label: 'SLA', color: 'text-amber-600 bg-amber-50' },
  data_quality: { label: 'Data Quality', color: 'text-blue-600 bg-blue-50' },
  breaches: { label: 'Breaches', color: 'text-red-600 bg-red-50' },
  fees: { label: 'Fees', color: 'text-green-600 bg-green-50' },
  compliance: { label: 'Compliance', color: 'text-purple-600 bg-purple-50' },
  risk: { label: 'Risk', color: 'text-orange-600 bg-orange-50' },
  reconciliation: { label: 'Reconciliation', color: 'text-indigo-600 bg-indigo-50' },
};

const severityLabels: Record<string, { label: string; color: string; icon: boolean }> = {
  critical: { label: 'Critical', color: 'text-red-600 bg-red-50', icon: true },
  high: { label: 'High', color: 'text-orange-600 bg-orange-50', icon: false },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-50', icon: false },
  low: { label: 'Low', color: 'text-stone-600 bg-stone-100', icon: false },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: 'Open', color: 'text-amber-600 bg-amber-50' },
  accepted: { label: 'Accepted', color: 'text-blue-600 bg-blue-50' },
  dismissed: { label: 'Dismissed', color: 'text-stone-500 bg-stone-100' },
  completed: { label: 'Completed', color: 'text-emerald-600 bg-emerald-50' },
};

export function AiTriageTable({
  items,
  onRowClick,
  onCreateTask,
  onAccept,
  onDismiss,
  compact = false,
}: AiTriageTableProps) {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const displayItems = compact ? items.filter(i => i.status === 'open').slice(0, 5) : items;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Item
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Категория
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Severity
              </th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                  Предложение
                </th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Статус
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item) => {
              const category = categoryLabels[item.category] || {
                label: item.category,
                color: 'text-stone-600 bg-stone-100',
              };
              const severity = severityLabels[item.severity] || severityLabels.medium;
              const status = statusLabels[item.status] || statusLabels.open;

              return (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <div>
                        <div className="text-stone-800 font-medium truncate max-w-xs">
                          {item.title}
                        </div>
                        {item.description && compact && (
                          <div className="text-xs text-stone-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${category.color}`}
                    >
                      {category.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${severity.color}`}
                    >
                      {severity.icon && <AlertTriangle className="w-3 h-3" />}
                      {severity.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-600 text-xs">
                      <span className="truncate max-w-xs block">{item.suggestedAction}</span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {item.status === 'open' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreateTask?.(item);
                            }}
                            className="p-1.5 text-stone-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                            title="Создать task"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAccept?.(item);
                            }}
                            className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDismiss?.(item);
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center text-stone-500">Нет triage items для отображения</div>
      )}
    </div>
  );
}

"use client";

import { ArrowRight, CheckCircle, Clock, PlayCircle, AlertTriangle, FileCheck } from 'lucide-react';

interface RiskAction {
  id: string;
  portfolioId: string;
  alertId: string;
  title: string;
  type: 'rebalance' | 'hedge' | 'escalation' | 'reporting';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  targetValue: number | null;
  currentValue: number | null;
  unit: string | null;
  dueDate: string;
  assignedTo: string;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string | null;
}

interface RkActionsTableProps {
  actions: RiskAction[];
  onRowClick?: (action: RiskAction) => void;
  onApprove?: (actionId: string) => void;
  showCompleted?: boolean;
}

const typeConfig = {
  rebalance: { icon: ArrowRight, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Ребалансировка' },
  hedge: { icon: ArrowRight, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Хеджирование' },
  escalation: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Эскалация' },
  reporting: { icon: FileCheck, color: 'text-stone-600', bg: 'bg-stone-100', label: 'Отчётность' },
};

const priorityConfig = {
  critical: { color: 'text-red-600', bg: 'bg-red-100', label: 'Критический' },
  high: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Высокий' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Средний' },
  low: { color: 'text-stone-600', bg: 'bg-stone-100', label: 'Низкий' },
};

const statusConfig = {
  pending: { icon: Clock, color: 'text-stone-600', bg: 'bg-stone-100', label: 'Ожидает' },
  approved: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Одобрено' },
  in_progress: { icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'В работе' },
  completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Выполнено' },
  cancelled: { icon: Clock, color: 'text-stone-400', bg: 'bg-stone-50', label: 'Отменено' },
};

export function RkActionsTable({ actions, onRowClick, onApprove, showCompleted = false }: RkActionsTableProps) {
  const filteredActions = showCompleted
    ? actions
    : actions.filter(a => a.status !== 'completed' && a.status !== 'cancelled');

  const sortedActions = [...filteredActions].sort((a, b) => {
    // Sort by priority and due date
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Действие</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Приоритет</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Цель</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Срок</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действие</th>
            </tr>
          </thead>
          <tbody>
            {sortedActions.map((action) => {
              const type = typeConfig[action.type];
              const priority = priorityConfig[action.priority];
              const status = statusConfig[action.status];
              const StatusIcon = status.icon;
              const overdue = isOverdue(action.dueDate) && action.status !== 'completed';

              return (
                <tr
                  key={action.id}
                  onClick={() => onRowClick?.(action)}
                  className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors ${
                    action.priority === 'critical' ? 'bg-red-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-stone-800">{action.title}</div>
                      <div className="text-xs text-stone-500 line-clamp-1">{action.description}</div>
                      {action.assignedTo && (
                        <div className="text-xs text-stone-400 mt-1">→ {action.assignedTo}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${type.bg} ${type.color}`}>
                      {type.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${priority.bg} ${priority.color}`}>
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {action.targetValue !== null && action.currentValue !== null && (
                      <div>
                        <div className="text-xs text-stone-500">
                          {action.currentValue}{action.unit || ''} → {action.targetValue}{action.unit || ''}
                        </div>
                        <div className="w-20 h-1.5 bg-stone-100 rounded-full mt-1 ml-auto overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                ((action.currentValue - action.targetValue) /
                                  (action.currentValue - action.targetValue || 1)) * 100,
                                100
                              )}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {action.targetValue === null && (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-stone-600'}`}>
                      {new Date(action.dueDate).toLocaleDateString('ru-RU')}
                    </div>
                    {overdue && (
                      <div className="text-xs text-red-500">Просрочено</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {action.status === 'pending' && onApprove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove(action.id);
                        }}
                        className="px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      >
                        Одобрить
                      </button>
                    )}
                    {action.status !== 'pending' && (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedActions.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          {showCompleted ? 'Нет действий для отображения' : 'Нет активных действий'}
        </div>
      )}
    </div>
  );
}

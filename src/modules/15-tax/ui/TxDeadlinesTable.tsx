"use client";

import { Calendar, AlertTriangle, Clock, CheckCircle, FileText, DollarSign, Flag } from 'lucide-react';

interface TaxDeadline {
  id: string;
  profileId: string;
  title: string;
  type: 'filing' | 'payment';
  jurisdiction: string;
  dueDate: string;
  status: 'overdue' | 'pending' | 'in_progress' | 'completed';
  amount: number | null;
  currency: string;
  description: string;
  penaltyRate: number | null;
  reminderDays: number[];
  assignedTo: string;
  completedAt: string | null;
  notes: string | null;
}

interface TxDeadlinesTableProps {
  deadlines: TaxDeadline[];
  onRowClick?: (deadline: TaxDeadline) => void;
  onComplete?: (id: string) => void;
  showCompleted?: boolean;
}

const typeConfig = {
  filing: { label: 'Подача', color: 'text-blue-600', bg: 'bg-blue-50', icon: FileText },
  payment: { label: 'Оплата', color: 'text-purple-600', bg: 'bg-purple-50', icon: DollarSign },
};

const statusConfig = {
  overdue: { label: 'Просрочено', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle },
  pending: { label: 'Ожидает', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
  in_progress: { label: 'В работе', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
  completed: { label: 'Выполнено', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle },
};

const jurisdictionLabels: Record<string, string> = {
  RU: '🇷🇺 Россия',
  US: '🇺🇸 США',
  GB: '🇬🇧 Великобритания',
  AE: '🇦🇪 ОАЭ',
  CH: '🇨🇭 Швейцария',
  SG: '🇸🇬 Сингапур',
  CY: '🇨🇾 Кипр',
};

export function TxDeadlinesTable({ deadlines, onRowClick, onComplete, showCompleted = false }: TxDeadlinesTableProps) {
  const now = new Date();

  const filteredDeadlines = showCompleted
    ? deadlines
    : deadlines.filter(d => d.status !== 'completed');

  const sortedDeadlines = [...filteredDeadlines].sort((a, b) => {
    // Overdue first, then by date
    const statusOrder = { overdue: 0, pending: 1, in_progress: 1, completed: 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Group by month
  const groupedByMonth = sortedDeadlines.reduce((acc, deadline) => {
    const month = new Date(deadline.dueDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(deadline);
    return acc;
  }, {} as Record<string, TaxDeadline[]>);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-red-50 rounded-xl p-3 border border-red-200">
          <div className="text-xs text-red-600 font-medium">Просрочено</div>
          <div className="text-2xl font-bold text-red-700">
            {deadlines.filter(d => d.status === 'overdue').length}
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
          <div className="text-xs text-amber-600 font-medium">На этой неделе</div>
          <div className="text-2xl font-bold text-amber-700">
            {deadlines.filter(d => {
              const days = getDaysUntil(d.dueDate);
              return d.status !== 'completed' && days > 0 && days <= 7;
            }).length}
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
          <div className="text-xs text-blue-600 font-medium">В этом месяце</div>
          <div className="text-2xl font-bold text-blue-700">
            {deadlines.filter(d => {
              const days = getDaysUntil(d.dueDate);
              return d.status !== 'completed' && days > 7 && days <= 30;
            }).length}
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
          <div className="text-xs text-emerald-600 font-medium">Выполнено</div>
          <div className="text-2xl font-bold text-emerald-700">
            {deadlines.filter(d => d.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Grouped Deadlines */}
      {Object.entries(groupedByMonth).map(([month, monthDeadlines]) => (
        <div key={month} className="space-y-2">
          <h3 className="text-sm font-semibold text-stone-600 uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {month}
          </h3>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
            {monthDeadlines.map((deadline) => {
              const type = typeConfig[deadline.type];
              const status = statusConfig[deadline.status];
              const TypeIcon = type.icon;
              const StatusIcon = status.icon;
              const daysUntil = getDaysUntil(deadline.dueDate);

              return (
                <div
                  key={deadline.id}
                  onClick={() => onRowClick?.(deadline)}
                  className={`p-4 hover:bg-stone-50 cursor-pointer transition-colors ${
                    deadline.status === 'overdue' ? 'bg-red-50/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TypeIcon className={`w-4 h-4 ${type.color}`} />
                        <span className="font-semibold text-stone-800">{deadline.title}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {status.label}
                        </span>
                      </div>
                      <div className="text-sm text-stone-600 mb-2">{deadline.description}</div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-stone-500">
                          <Flag className="w-3 h-3 inline mr-1" />
                          {jurisdictionLabels[deadline.jurisdiction] || deadline.jurisdiction}
                        </span>
                        {deadline.amount !== null && (
                          <span className="text-stone-500">
                            Сумма: <span className="font-medium text-stone-700">
                              {formatCurrency(deadline.amount, deadline.currency)}
                            </span>
                          </span>
                        )}
                        <span className="text-stone-500">
                          Ответственный: <span className="font-medium text-stone-700">{deadline.assignedTo}</span>
                        </span>
                      </div>
                      {deadline.notes && (
                        <div className="mt-2 text-xs text-stone-500 italic">{deadline.notes}</div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        deadline.status === 'overdue' ? 'text-red-600' :
                        daysUntil <= 7 ? 'text-amber-600' :
                        'text-stone-700'
                      }`}>
                        {new Date(deadline.dueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </div>
                      {deadline.status !== 'completed' && (
                        <div className={`text-xs ${
                          deadline.status === 'overdue' ? 'text-red-500' :
                          daysUntil <= 7 ? 'text-amber-500' :
                          'text-stone-500'
                        }`}>
                          {deadline.status === 'overdue'
                            ? `${Math.abs(daysUntil)} дн. назад`
                            : `через ${daysUntil} дн.`
                          }
                        </div>
                      )}
                      {deadline.status !== 'completed' && onComplete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(deadline.id);
                          }}
                          className="mt-2 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          Выполнено
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {sortedDeadlines.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <div>Нет дедлайнов для отображения</div>
        </div>
      )}
    </div>
  );
}

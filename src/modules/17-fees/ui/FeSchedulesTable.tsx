"use client";

import { Percent, DollarSign, TrendingUp, CheckCircle, XCircle, Layers } from 'lucide-react';

interface FeeSchedule {
  id: string;
  clientId: string;
  name: string;
  type: 'aum' | 'fixed' | 'performance';
  ratePct: number | null;
  fixedAmount: number | null;
  tiersJson: string | null;
  minFee: number | null;
  currency: string;
  status: 'active' | 'inactive';
}

interface FeSchedulesTableProps {
  schedules: FeeSchedule[];
  onRowClick?: (schedule: FeeSchedule) => void;
  clientNames?: Record<string, string>;
}

const typeConfig = {
  aum: { label: 'AUM', color: 'text-blue-600', bg: 'bg-blue-50', Icon: Percent },
  fixed: { label: 'Fixed', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: DollarSign },
  performance: { label: 'Performance', color: 'text-purple-600', bg: 'bg-purple-50', Icon: TrendingUp },
};

const statusConfig = {
  active: { label: 'Активен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  inactive: { label: 'Неактивен', color: 'text-stone-500', bg: 'bg-stone-100', Icon: XCircle },
};

export function FeSchedulesTable({
  schedules,
  onRowClick,
  clientNames = {},
}: FeSchedulesTableProps) {
  const formatRate = (schedule: FeeSchedule): string => {
    if (schedule.type === 'fixed' && schedule.fixedAmount) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: schedule.currency,
        minimumFractionDigits: 0,
      }).format(schedule.fixedAmount);
    }
    if (schedule.ratePct !== null) {
      return `${schedule.ratePct}%`;
    }
    return '—';
  };

  const hasTiers = (schedule: FeeSchedule): boolean => {
    if (!schedule.tiersJson) return false;
    try {
      const tiers = JSON.parse(schedule.tiersJson);
      return Array.isArray(tiers) && tiers.length > 0;
    } catch {
      return false;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Название</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Клиент</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Ставка / Сумма</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Tiers</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Min Fee</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => {
              const type = typeConfig[schedule.type];
              const status = statusConfig[schedule.status];
              const TypeIcon = type.Icon;
              const StatusIcon = status.Icon;

              return (
                <tr
                  key={schedule.id}
                  onClick={() => onRowClick?.(schedule)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-stone-800">{schedule.name}</div>
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {clientNames[schedule.clientId] || schedule.clientId}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${type.bg} ${type.color}`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      {type.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-stone-800">
                    {formatRate(schedule)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasTiers(schedule) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-600 bg-amber-50 rounded">
                        <Layers className="w-3 h-3" />
                        Да
                      </span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">
                    {schedule.minFee ? (
                      new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: schedule.currency,
                        minimumFractionDigits: 0,
                      }).format(schedule.minFee)
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {schedules.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет расписаний для отображения
        </div>
      )}
    </div>
  );
}

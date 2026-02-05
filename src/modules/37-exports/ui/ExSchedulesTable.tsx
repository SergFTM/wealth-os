'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Pause, Eye, Clock, Calendar } from 'lucide-react';
import { ExStatusPill } from './ExStatusPill';

export interface ExportSchedule {
  id: string;
  name: string;
  templateId: string;
  templateName?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand';
  nextRunAt?: string;
  lastRunAt?: string;
  runCount: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

interface ExSchedulesTableProps {
  schedules: ExportSchedule[];
  onOpen: (id: string) => void;
  onRunNow: (id: string) => void;
  onTogglePause: (id: string, currentStatus: string) => void;
  loading?: boolean;
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Ежедневно',
  weekly: 'Еженедельно',
  monthly: 'Ежемесячно',
  quarterly: 'Ежеквартально',
  yearly: 'Ежегодно',
  on_demand: 'По запросу',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatNextRun(dateStr?: string): { text: string; isOverdue: boolean } {
  if (!dateStr) return { text: '—', isOverdue: false };
  const date = new Date(dateStr);
  const now = new Date();
  const isOverdue = date < now;

  return {
    text: formatDate(dateStr),
    isOverdue,
  };
}

export function ExSchedulesTable({
  schedules,
  onOpen,
  onRunNow,
  onTogglePause,
  loading = false,
}: ExSchedulesTableProps) {
  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Нет расписаний. Создайте расписание для автоматических выгрузок.
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Шаблон
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Частота
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Следующий запуск
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Последний запуск
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Запусков
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {schedules.map((schedule) => {
            const nextRun = formatNextRun(schedule.nextRunAt);
            return (
              <tr key={schedule.id} className="hover:bg-white/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {schedule.name || `Schedule ${schedule.id.slice(0, 8)}`}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {schedule.templateName || schedule.templateId.slice(0, 8)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    {FREQUENCY_LABELS[schedule.frequency]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={nextRun.isOverdue ? 'text-red-500' : 'text-gray-600'}>
                    {nextRun.text}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(schedule.lastRunAt)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{schedule.runCount}</td>
                <td className="px-4 py-3">
                  <ExStatusPill status={schedule.status} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onRunNow(schedule.id)}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Запустить сейчас"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onTogglePause(schedule.id, schedule.status)}
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title={schedule.status === 'paused' ? 'Возобновить' : 'Пауза'}
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpen(schedule.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Открыть"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ExSchedulesTable;

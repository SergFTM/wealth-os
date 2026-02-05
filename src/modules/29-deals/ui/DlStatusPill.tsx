'use client';

import { cn } from '@/lib/utils';

interface DlStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  // Deal status
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Активно' },
  'on-hold': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'На паузе' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Закрыто' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Отменено' },
  // Transaction status
  draft: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Черновик' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Ожидает' },
  posted: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Проведено' },
  reversed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Отменено' },
  // Approval status
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Одобрено' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Отклонено' },
  escalated: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Эскалация' },
  // Corporate action status
  announced: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Объявлено' },
  planned: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Запланировано' },
  applied: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Применено' },
  // Capital event status
  open: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Открыто' },
  partially_funded: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Частично' },
  // Document status
  missing: { bg: 'bg-red-100', text: 'text-red-700', label: 'Отсутствует' },
  received: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Получено' },
  reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Проверено' },
};

export function DlStatusPill({ status, size = 'md' }: DlStatusPillProps) {
  const config = statusConfig[status] || { bg: 'bg-slate-100', text: 'text-slate-600', label: status };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.bg,
        config.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {config.label}
    </span>
  );
}

export function DlStagePill({ stageId, stageName }: { stageId: string; stageName?: string }) {
  const stageColors: Record<string, string> = {
    'stage-1': 'bg-slate-100 text-slate-700',
    'stage-2': 'bg-blue-100 text-blue-700',
    'stage-3': 'bg-purple-100 text-purple-700',
    'stage-4': 'bg-pink-100 text-pink-700',
    'stage-5': 'bg-orange-100 text-orange-700',
    'stage-6': 'bg-green-100 text-green-700',
    'stage-7': 'bg-emerald-100 text-emerald-700',
  };

  const stageLabels: Record<string, string> = {
    'stage-1': 'Поиск',
    'stage-2': 'Скрининг',
    'stage-3': 'Комитет',
    'stage-4': 'Юридическая',
    'stage-5': 'Закрытие',
    'stage-6': 'Пост-закрытие',
    'stage-7': 'Закрыто',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        stageColors[stageId] || 'bg-slate-100 text-slate-600'
      )}
    >
      {stageName || stageLabels[stageId] || stageId}
    </span>
  );
}

export function DlAssetTypePill({ type }: { type: string }) {
  const typeConfig: Record<string, { bg: string; text: string; label: string }> = {
    'private-equity': { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'PE' },
    'venture': { bg: 'bg-violet-100', text: 'text-violet-700', label: 'VC' },
    'real-estate': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'RE' },
    'public': { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Public' },
    'debt': { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Debt' },
    'infrastructure': { bg: 'bg-green-100', text: 'text-green-700', label: 'Infra' },
  };

  const config = typeConfig[type] || { bg: 'bg-slate-100', text: 'text-slate-600', label: type };

  return (
    <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium', config.bg, config.text)}>
      {config.label}
    </span>
  );
}

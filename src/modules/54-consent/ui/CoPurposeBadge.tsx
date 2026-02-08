"use client";

type Purpose = 'audit' | 'tax' | 'legal' | 'advisor_access' | 'banking' | 'other';

interface CoPurposeBadgeProps {
  purpose: Purpose;
}

const purposeConfig: Record<Purpose, { label: string; className: string }> = {
  audit: {
    label: 'Аудит',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  tax: {
    label: 'Налоги',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  legal: {
    label: 'Юридический',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  advisor_access: {
    label: 'Доступ советника',
    className: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  banking: {
    label: 'Банкинг',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  other: {
    label: 'Прочее',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  },
};

export function CoPurposeBadge({ purpose }: CoPurposeBadgeProps) {
  const config = purposeConfig[purpose] || purposeConfig.other;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

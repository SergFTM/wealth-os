'use client';

interface CsStatusPillProps {
  status: 'open' | 'in_progress' | 'awaiting_client' | 'resolved' | 'closed';
  locale?: string;
}

const statusLabels: Record<string, Record<string, string>> = {
  open: { ru: 'Открыт', en: 'Open', uk: 'Відкритий' },
  in_progress: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' },
  awaiting_client: { ru: 'Ожидает клиента', en: 'Awaiting Client', uk: 'Очікує клієнта' },
  resolved: { ru: 'Решен', en: 'Resolved', uk: 'Вирішено' },
  closed: { ru: 'Закрыт', en: 'Closed', uk: 'Закритий' },
};

const statusStyles: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  awaiting_client: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-purple-100 text-purple-700 border-purple-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusDots: Record<string, string> = {
  open: 'bg-emerald-500',
  in_progress: 'bg-blue-500 animate-pulse',
  awaiting_client: 'bg-amber-500',
  resolved: 'bg-purple-500',
  closed: 'bg-gray-400',
};

export function CsStatusPill({ status, locale = 'ru' }: CsStatusPillProps) {
  const label = statusLabels[status]?.[locale] || statusLabels[status]?.ru || status;
  const style = statusStyles[status] || statusStyles.open;
  const dotStyle = statusDots[status] || statusDots.open;

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border
        ${style}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyle}`} />
      {label}
    </span>
  );
}

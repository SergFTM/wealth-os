'use client';

interface CsPriorityPillProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  locale?: string;
}

const priorityLabels: Record<string, Record<string, string>> = {
  low: { ru: 'Низкий', en: 'Low', uk: 'Низький' },
  medium: { ru: 'Средний', en: 'Medium', uk: 'Середній' },
  high: { ru: 'Высокий', en: 'High', uk: 'Високий' },
  critical: { ru: 'Критичный', en: 'Critical', uk: 'Критичний' },
};

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-amber-100 text-amber-700 border-amber-200',
  critical: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
};

export function CsPriorityPill({ priority, locale = 'ru' }: CsPriorityPillProps) {
  const label = priorityLabels[priority]?.[locale] || priorityLabels[priority]?.ru || priority;
  const style = priorityStyles[priority] || priorityStyles.medium;

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border
        ${style}
      `}
    >
      {priority === 'critical' && (
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5" />
      )}
      {label}
    </span>
  );
}

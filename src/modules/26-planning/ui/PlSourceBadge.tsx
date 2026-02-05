'use client';

/**
 * Planning Source Badge Component
 * Shows data source and as-of date
 */

interface PlSourceBadgeProps {
  source: string;
  asOfDate?: string;
  lang?: 'ru' | 'en' | 'uk';
}

const SOURCE_LABELS: Record<string, { ru: string; en: string; uk: string }> = {
  manual: { ru: 'Вручную', en: 'Manual', uk: 'Вручну' },
  import: { ru: 'Импорт', en: 'Import', uk: 'Імпорт' },
  calculated: { ru: 'Расчёт', en: 'Calculated', uk: 'Розрахунок' },
  api: { ru: 'API', en: 'API', uk: 'API' },
  networth: { ru: 'Net Worth', en: 'Net Worth', uk: 'Net Worth' },
  gl: { ru: 'GL', en: 'GL', uk: 'GL' },
  billpay: { ru: 'Bill Pay', en: 'Bill Pay', uk: 'Bill Pay' },
  synced: { ru: 'Синхронизация', en: 'Synced', uk: 'Синхронізація' },
};

export function PlSourceBadge({ source, asOfDate, lang = 'ru' }: PlSourceBadgeProps) {
  const sourceLabel = SOURCE_LABELS[source]?.[lang] || source;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <span className="bg-gray-100 px-1.5 py-0.5 rounded">{sourceLabel}</span>
      {asOfDate && (
        <span className="text-gray-400">
          {lang === 'ru' ? 'на' : lang === 'uk' ? 'на' : 'as of'} {formatDate(asOfDate)}
        </span>
      )}
    </span>
  );
}

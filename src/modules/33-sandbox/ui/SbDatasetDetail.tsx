'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SbStatusPill } from './SbStatusPill';

interface Dataset {
  id: string;
  name: string;
  description?: string;
  templateType: string;
  includesJson?: string[];
  statsJson?: { totalRecords?: number; collections?: number; sizeKb?: number };
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface SbDatasetDetailProps {
  dataset: Dataset;
  onClone?: () => void;
  onReset?: () => void;
}

const i18n = {
  ru: { back: '← Назад', template: 'Шаблон', status: 'Статус', records: 'Всего записей', collections: 'Коллекции', size: 'Размер', created: 'Создано', updated: 'Обновлено', clone: 'Клонировать в среду', reset: 'Сбросить данные' },
  en: { back: '← Back', template: 'Template', status: 'Status', records: 'Total Records', collections: 'Collections', size: 'Size', created: 'Created', updated: 'Updated', clone: 'Clone to environment', reset: 'Reset data' },
  uk: { back: '← Назад', template: 'Шаблон', status: 'Статус', records: 'Всього записів', collections: 'Колекції', size: 'Розмір', created: 'Створено', updated: 'Оновлено', clone: 'Клонувати в середовище', reset: 'Скинути дані' },
};

export function SbDatasetDetail({ dataset, onClone, onReset }: SbDatasetDetailProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/m/sandbox/list?tab=datasets')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-stone-800">{dataset.name}</h1>
          {dataset.description && (
            <p className="text-sm text-stone-500 mt-1">{dataset.description}</p>
          )}
        </div>
        <SbStatusPill status={dataset.status} size="md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100/50 p-4">
          <div className="text-2xl font-bold text-stone-800">
            {dataset.statsJson?.totalRecords?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-stone-500">{t.records}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100/50 p-4">
          <div className="text-2xl font-bold text-stone-800">
            {dataset.statsJson?.collections || 0}
          </div>
          <div className="text-xs text-stone-500">{t.collections}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100/50 p-4">
          <div className="text-2xl font-bold text-stone-800">
            {dataset.statsJson?.sizeKb ? `${(dataset.statsJson.sizeKb / 1024).toFixed(1)}` : '0'} MB
          </div>
          <div className="text-xs text-stone-500">{t.size}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100/50 p-4">
          <div className="text-lg font-bold text-stone-800">{dataset.templateType}</div>
          <div className="text-xs text-stone-500">{t.template}</div>
        </div>
      </div>

      {/* Collections */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">{t.collections}</h3>
        {dataset.includesJson && dataset.includesJson.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dataset.includesJson.map((col) => (
              <span
                key={col}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-lg"
              >
                {col}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-500">No collections</p>
        )}
      </div>

      {/* Meta Info */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-stone-500">{t.created}</dt>
            <dd className="text-sm font-medium text-stone-800">
              {new Date(dataset.createdAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">{t.updated}</dt>
            <dd className="text-sm font-medium text-stone-800">
              {new Date(dataset.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={onClone}
            className="bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            {t.clone}
          </Button>
          <Button variant="ghost" onClick={onReset}>
            {t.reset}
          </Button>
        </div>
      </div>
    </div>
  );
}

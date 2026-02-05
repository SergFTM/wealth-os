'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { SbStatusPill } from './SbStatusPill';

interface Dataset {
  id: string;
  name: string;
  description?: string;
  templateType: string;
  statsJson?: { totalRecords?: number; collections?: number; sizeKb?: number };
  status: 'active' | 'archived';
  updatedAt: string;
}

interface SbDatasetsTableProps {
  datasets: Dataset[];
  onClone?: (id: string) => void;
  onReset?: (id: string) => void;
}

const i18n = {
  ru: { name: 'Название', template: 'Шаблон', records: 'Записей', collections: 'Коллекций', size: 'Размер', status: 'Статус', updated: 'Обновлено', actions: 'Действия', clone: 'Клонировать', reset: 'Сбросить', noData: 'Нет датасетов' },
  en: { name: 'Name', template: 'Template', records: 'Records', collections: 'Collections', size: 'Size', status: 'Status', updated: 'Updated', actions: 'Actions', clone: 'Clone', reset: 'Reset', noData: 'No datasets' },
  uk: { name: 'Назва', template: 'Шаблон', records: 'Записів', collections: 'Колекцій', size: 'Розмір', status: 'Статус', updated: 'Оновлено', actions: 'Дії', clone: 'Клонувати', reset: 'Скинути', noData: 'Немає датасетів' },
};

export function SbDatasetsTable({ datasets, onClone, onReset }: SbDatasetsTableProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  if (datasets.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-8 text-center">
        <p className="text-stone-500">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.name}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.template}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase">{t.records}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase">{t.collections}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase">{t.size}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.status}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((ds) => (
              <tr
                key={ds.id}
                className="border-b border-stone-50 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/m/sandbox/dataset/${ds.id}`)}
              >
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-stone-800 text-sm">{ds.name}</div>
                    {ds.description && <div className="text-xs text-stone-500 truncate max-w-xs">{ds.description}</div>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">{ds.templateType}</td>
                <td className="px-4 py-3 text-sm text-stone-800 text-right font-mono">
                  {ds.statsJson?.totalRecords?.toLocaleString() || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-stone-800 text-right">
                  {ds.statsJson?.collections || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600 text-right">
                  {ds.statsJson?.sizeKb ? `${(ds.statsJson.sizeKb / 1024).toFixed(1)} MB` : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <SbStatusPill status={ds.status} />
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onClone?.(ds.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {t.clone}
                    </button>
                    <button
                      onClick={() => onReset?.(ds.id)}
                      className="text-xs text-stone-500 hover:text-stone-700"
                    >
                      {t.reset}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

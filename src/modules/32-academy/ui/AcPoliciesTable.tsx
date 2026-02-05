'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AcStatusPill } from './AcStatusPill';

interface Policy {
  id: string;
  titleRu: string;
  titleEn?: string;
  categoryKey: string;
  audience: string;
  version: string;
  status: string;
  requiresAck?: boolean;
  updatedAt: string;
}

interface AcPoliciesTableProps {
  policies: Policy[];
  onAcknowledge?: (id: string) => void;
}

export function AcPoliciesTable({ policies, onAcknowledge }: AcPoliciesTableProps) {
  const router = useRouter();
  const { locale } = useApp();

  const labels = {
    title: { ru: 'Политика', en: 'Policy', uk: 'Політика' },
    category: { ru: 'Категория', en: 'Category', uk: 'Категорія' },
    audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
    version: { ru: 'Версия', en: 'Version', uk: 'Версія' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    updated: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    acknowledge: { ru: 'Ознакомиться', en: 'Acknowledge', uk: 'Ознайомитись' },
  };

  const categoryLabels: Record<string, Record<string, string>> = {
    security: { ru: 'Безопасность', en: 'Security', uk: 'Безпека' },
    data: { ru: 'Данные', en: 'Data', uk: 'Дані' },
    compliance: { ru: 'Комплаенс', en: 'Compliance', uk: 'Комплаєнс' },
    operational: { ru: 'Операционная', en: 'Operational', uk: 'Операційна' },
    hr: { ru: 'HR', en: 'HR', uk: 'HR' },
    other: { ru: 'Другое', en: 'Other', uk: 'Інше' },
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.title[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.category[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.audience[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.version[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.status[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.updated[locale]}
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.actions[locale]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {policies.map((policy) => (
              <tr
                key={policy.id}
                className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-800">
                      {locale === 'ru' ? policy.titleRu : policy.titleEn || policy.titleRu}
                    </span>
                    {policy.requiresAck && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" title="Requires acknowledgement" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {categoryLabels[policy.categoryKey]?.[locale] || policy.categoryKey}
                </td>
                <td className="px-4 py-3">
                  <AcStatusPill status={policy.audience} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  v{policy.version}
                </td>
                <td className="px-4 py-3">
                  <AcStatusPill status={policy.status} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-500">
                  {new Date(policy.updatedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-xs text-emerald-600 hover:text-emerald-700">
                      {labels.open[locale]}
                    </button>
                    {policy.requiresAck && onAcknowledge && (
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => onAcknowledge(policy.id)}
                      >
                        {labels.acknowledge[locale]}
                      </button>
                    )}
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

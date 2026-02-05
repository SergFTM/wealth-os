'use client';

/**
 * Admin Policies Table Component
 * Display and manage policy banners
 */

import { useState } from 'react';
import Link from 'next/link';
import { PolicyBanner, policyModuleLabels, policySeverityLabels, policyPlacementLabels } from '../schema/policyBanner';

interface AdPoliciesTableProps {
  banners: PolicyBanner[];
  onToggle: (id: string, status: 'active' | 'inactive') => Promise<void>;
  onCreate: () => void;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  module: { ru: 'Модуль', en: 'Module', uk: 'Модуль' },
  text: { ru: 'Текст', en: 'Text', uk: 'Текст' },
  severity: { ru: 'Тип', en: 'Severity', uk: 'Тип' },
  placement: { ru: 'Размещение', en: 'Placement', uk: 'Розміщення' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
  active: { ru: 'Активен', en: 'Active', uk: 'Активний' },
  inactive: { ru: 'Неактивен', en: 'Inactive', uk: 'Неактивний' },
  activate: { ru: 'Активировать', en: 'Activate', uk: 'Активувати' },
  deactivate: { ru: 'Деактивировать', en: 'Deactivate', uk: 'Деактивувати' },
  edit: { ru: 'Редактировать', en: 'Edit', uk: 'Редагувати' },
  addBanner: { ru: 'Добавить баннер', en: 'Add Banner', uk: 'Додати банер' },
  noBanners: { ru: 'Нет баннеров', en: 'No banners', uk: 'Немає банерів' },
};

const severityColors = {
  info: 'bg-blue-100 text-blue-800',
  warn: 'bg-amber-100 text-amber-800',
};

const statusColors = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-gray-100 text-gray-600',
};

export function AdPoliciesTable({ banners, onToggle, onCreate, lang = 'ru' }: AdPoliciesTableProps) {
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggle = async (banner: PolicyBanner) => {
    setToggling(banner.id);
    try {
      await onToggle(banner.id, banner.status === 'active' ? 'inactive' : 'active');
    } finally {
      setToggling(null);
    }
  };

  const getBannerText = (banner: PolicyBanner): string => {
    switch (lang) {
      case 'ru': return banner.textRu;
      case 'en': return banner.textEn || banner.textRu;
      case 'uk': return banner.textUk || banner.textRu;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {banners.length} {lang === 'ru' ? 'баннеров' : lang === 'uk' ? 'банерів' : 'banners'}
        </div>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
        >
          {labels.addBanner[lang]}
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {labels.noBanners[lang]}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{labels.module[lang]}</th>
                <th className="px-4 py-3 text-left font-medium">{labels.text[lang]}</th>
                <th className="px-4 py-3 text-left font-medium">{labels.severity[lang]}</th>
                <th className="px-4 py-3 text-left font-medium">{labels.placement[lang]}</th>
                <th className="px-4 py-3 text-left font-medium">{labels.status[lang]}</th>
                <th className="px-4 py-3 text-right font-medium">{labels.actions[lang]}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {banners.map(banner => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {policyModuleLabels[banner.moduleKey][lang]}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    <div className="truncate" title={getBannerText(banner)}>
                      {getBannerText(banner)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${severityColors[banner.severity]}`}>
                      {policySeverityLabels[banner.severity][lang]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {policyPlacementLabels[banner.placement][lang]}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[banner.status]}`}>
                      {banner.status === 'active' ? labels.active[lang] : labels.inactive[lang]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggle(banner)}
                        disabled={toggling === banner.id}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      >
                        {toggling === banner.id ? '...' : (
                          banner.status === 'active' ? labels.deactivate[lang] : labels.activate[lang]
                        )}
                      </button>
                      <Link
                        href={`/m/admin/item/${banner.id}?type=policy`}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {labels.edit[lang]}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

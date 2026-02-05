'use client';

/**
 * Admin Feature Flags Table Component
 * Display and manage feature flags
 */

import { useState } from 'react';
import { FeatureFlag, flagAudienceLabels } from '../schema/featureFlag';

interface AdFlagsTableProps {
  flags: FeatureFlag[];
  onToggle: (id: string, enabled: boolean) => Promise<void>;
  onCreate: () => void;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  key: { ru: 'Ключ', en: 'Key', uk: 'Ключ' },
  description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
  audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
  rollout: { ru: 'Rollout %', en: 'Rollout %', uk: 'Rollout %' },
  enabled: { ru: 'Включен', en: 'Enabled', uk: 'Увімкнено' },
  addFlag: { ru: 'Создать флаг', en: 'Create Flag', uk: 'Створити флаг' },
  noFlags: { ru: 'Нет флагов', en: 'No flags', uk: 'Немає флагів' },
  filterEnabled: { ru: 'Только включенные', en: 'Enabled only', uk: 'Тільки увімкнені' },
  all: { ru: 'Все', en: 'All', uk: 'Всі' },
};

const audienceColors = {
  staff: 'bg-purple-100 text-purple-800',
  client: 'bg-blue-100 text-blue-800',
  both: 'bg-emerald-100 text-emerald-800',
};

export function AdFlagsTable({ flags, onToggle, onCreate, lang = 'ru' }: AdFlagsTableProps) {
  const [toggling, setToggling] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'enabled'>('all');

  const handleToggle = async (flag: FeatureFlag) => {
    setToggling(flag.id);
    try {
      await onToggle(flag.id, !flag.enabled);
    } finally {
      setToggling(null);
    }
  };

  const filteredFlags = filter === 'enabled'
    ? flags.filter(f => f.enabled)
    : flags;

  const getDescription = (flag: FeatureFlag): string => {
    switch (lang) {
      case 'ru': return flag.descriptionRu || flag.description;
      case 'uk': return flag.descriptionUk || flag.description;
      default: return flag.description;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {filteredFlags.length} {lang === 'ru' ? 'флагов' : lang === 'uk' ? 'флагів' : 'flags'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded ${
                filter === 'all' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100'
              }`}
            >
              {labels.all[lang]}
            </button>
            <button
              onClick={() => setFilter('enabled')}
              className={`px-3 py-1 text-xs rounded ${
                filter === 'enabled' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100'
              }`}
            >
              {labels.filterEnabled[lang]}
            </button>
          </div>
        </div>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
        >
          {labels.addFlag[lang]}
        </button>
      </div>

      {filteredFlags.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {labels.noFlags[lang]}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{labels.key[lang]}</th>
                <th className="px-4 py-3 text-left font-medium">{labels.description[lang]}</th>
                <th className="px-4 py-3 text-left font-medium">{labels.audience[lang]}</th>
                <th className="px-4 py-3 text-center font-medium">{labels.rollout[lang]}</th>
                <th className="px-4 py-3 text-center font-medium">{labels.enabled[lang]}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredFlags.map(flag => (
                <tr key={flag.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                      {flag.key}
                    </code>
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    <div className="truncate text-gray-600" title={getDescription(flag)}>
                      {getDescription(flag)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${audienceColors[flag.audience]}`}>
                      {flagAudienceLabels[flag.audience][lang]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${flag.rolloutPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{flag.rolloutPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(flag)}
                      disabled={toggling === flag.id}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        flag.enabled ? 'bg-emerald-500' : 'bg-gray-300'
                      } ${toggling === flag.id ? 'opacity-50' : ''}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          flag.enabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
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

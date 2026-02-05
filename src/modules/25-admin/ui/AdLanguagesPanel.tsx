'use client';

/**
 * Admin Languages Panel Component
 * Configure i18n settings and overrides
 */

import { useState } from 'react';
import { LanguageConfig, SupportedLanguage, LanguageOverride, languageLabels, ALL_LANGUAGES } from '../schema/languageOverrides';
import { exportOverridesAsJson, importOverridesFromJson } from '../engine/languageManager';

interface AdLanguagesPanelProps {
  config: LanguageConfig | null;
  onSave: (config: Partial<LanguageConfig>) => Promise<void>;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  defaultLang: { ru: 'Язык по умолчанию', en: 'Default Language', uk: 'Мова за замовчуванням' },
  enabledLangs: { ru: 'Включенные языки', en: 'Enabled Languages', uk: 'Увімкнені мови' },
  overrides: { ru: 'Переопределения терминов', en: 'Term Overrides', uk: 'Перевизначення термінів' },
  addOverride: { ru: 'Добавить переопределение', en: 'Add Override', uk: 'Додати перевизначення' },
  key: { ru: 'Ключ', en: 'Key', uk: 'Ключ' },
  valueRu: { ru: 'Значение (RU)', en: 'Value (RU)', uk: 'Значення (RU)' },
  valueEn: { ru: 'Значение (EN)', en: 'Value (EN)', uk: 'Значення (EN)' },
  valueUk: { ru: 'Значение (UK)', en: 'Value (UK)', uk: 'Значення (UK)' },
  importJson: { ru: 'Импорт JSON', en: 'Import JSON', uk: 'Імпорт JSON' },
  exportJson: { ru: 'Экспорт JSON', en: 'Export JSON', uk: 'Експорт JSON' },
  save: { ru: 'Сохранить настройки языка', en: 'Save Language Settings', uk: 'Зберегти налаштування мови' },
  remove: { ru: 'Удалить', en: 'Remove', uk: 'Видалити' },
};

export function AdLanguagesPanel({ config, onSave, lang = 'ru' }: AdLanguagesPanelProps) {
  const [defaultLanguage, setDefaultLanguage] = useState<SupportedLanguage>(config?.defaultLanguage || 'ru');
  const [enabledLanguages, setEnabledLanguages] = useState<SupportedLanguage[]>(config?.enabledLanguages || ['ru']);
  const [overrides, setOverrides] = useState<LanguageOverride[]>(config?.overrides || []);
  const [newKey, setNewKey] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleLanguage = (langCode: SupportedLanguage) => {
    if (langCode === defaultLanguage) return; // Can't disable default language
    setEnabledLanguages(prev =>
      prev.includes(langCode)
        ? prev.filter(l => l !== langCode)
        : [...prev, langCode]
    );
  };

  const addOverride = () => {
    if (!newKey.trim()) return;
    if (overrides.some(o => o.key === newKey.trim())) return;
    setOverrides([...overrides, { key: newKey.trim() }]);
    setNewKey('');
  };

  const updateOverride = (key: string, field: 'valueRu' | 'valueEn' | 'valueUk', value: string) => {
    setOverrides(prev =>
      prev.map(o => o.key === key ? { ...o, [field]: value } : o)
    );
  };

  const removeOverride = (key: string) => {
    setOverrides(prev => prev.filter(o => o.key !== key));
  };

  const handleExport = () => {
    const json = exportOverridesAsJson(overrides);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'language-overrides.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const imported = importOverridesFromJson(text);
      if (imported) {
        setOverrides(prev => {
          const merged = [...prev];
          imported.forEach(imp => {
            const idx = merged.findIndex(m => m.key === imp.key);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...imp };
            } else {
              merged.push(imp);
            }
          });
          return merged;
        });
      }
    };
    input.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ defaultLanguage, enabledLanguages, overrides });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Default Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.defaultLang[lang]}
        </label>
        <select
          value={defaultLanguage}
          onChange={e => {
            const newDefault = e.target.value as SupportedLanguage;
            setDefaultLanguage(newDefault);
            if (!enabledLanguages.includes(newDefault)) {
              setEnabledLanguages([...enabledLanguages, newDefault]);
            }
          }}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          {ALL_LANGUAGES.map(l => (
            <option key={l} value={l}>{languageLabels[l][lang]}</option>
          ))}
        </select>
      </div>

      {/* Enabled Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {labels.enabledLangs[lang]}
        </label>
        <div className="flex gap-4">
          {ALL_LANGUAGES.map(l => (
            <label
              key={l}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                enabledLanguages.includes(l)
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200'
              } ${l === defaultLanguage ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="checkbox"
                checked={enabledLanguages.includes(l)}
                onChange={() => toggleLanguage(l)}
                disabled={l === defaultLanguage}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-sm font-medium">{languageLabels[l][lang]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Overrides */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            {labels.overrides[lang]} ({overrides.length})
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {labels.importJson[lang]}
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {labels.exportJson[lang]}
            </button>
          </div>
        </div>

        {/* Add Override */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder={labels.key[lang]}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            onKeyDown={e => e.key === 'Enter' && addOverride()}
          />
          <button
            onClick={addOverride}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
          >
            {labels.addOverride[lang]}
          </button>
        </div>

        {/* Overrides Table */}
        {overrides.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">{labels.key[lang]}</th>
                  <th className="px-3 py-2 text-left font-medium">RU</th>
                  <th className="px-3 py-2 text-left font-medium">EN</th>
                  <th className="px-3 py-2 text-left font-medium">UK</th>
                  <th className="px-3 py-2 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {overrides.map(override => (
                  <tr key={override.key}>
                    <td className="px-3 py-2 font-mono text-xs">{override.key}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={override.valueRu || ''}
                        onChange={e => updateOverride(override.key, 'valueRu', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={override.valueEn || ''}
                        onChange={e => updateOverride(override.key, 'valueEn', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={override.valueUk || ''}
                        onChange={e => updateOverride(override.key, 'valueUk', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removeOverride(override.key)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {labels.remove[lang]}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? '...' : labels.save[lang]}
        </button>
      </div>
    </div>
  );
}

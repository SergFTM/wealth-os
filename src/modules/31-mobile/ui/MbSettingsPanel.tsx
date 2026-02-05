'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';

const labels = {
  title: { ru: 'Настройки мобильного режима', en: 'Mobile Settings', uk: 'Налаштування мобільного режиму' },
  defaultTopics: { ru: 'Топики по умолчанию', en: 'Default Topics', uk: 'Топіки за замовчуванням' },
  offlineDefaults: { ru: 'Offline по умолчанию', en: 'Offline Defaults', uk: 'Offline за замовчуванням' },
  installBanner: { ru: 'Показывать баннер установки', en: 'Show Install Banner', uk: 'Показувати банер встановлення' },
  mfaRequired: { ru: 'Требовать MFA на мобильных', en: 'Require MFA on Mobile', uk: 'Вимагати MFA на мобільних' },
  biometric: { ru: 'Биометрия (MVP placeholder)', en: 'Biometrics (MVP placeholder)', uk: 'Біометрія (MVP placeholder)' },
  save: { ru: 'Сохранить', en: 'Save', uk: 'Зберегти' },
  saving: { ru: 'Сохранение...', en: 'Saving...', uk: 'Збереження...' },
  saved: { ru: 'Сохранено!', en: 'Saved!', uk: 'Збережено!' },
  enabled: { ru: 'Включено', en: 'Enabled', uk: 'Увімкнено' },
  disabled: { ru: 'Выключено', en: 'Disabled', uk: 'Вимкнено' },
};

const topics = ['approvals', 'reports', 'risk', 'invoices', 'messages', 'tasks', 'alerts', 'documents'];

export function MbSettingsPanel() {
  const { locale } = useApp();
  const [settings, setSettings] = useState({
    defaultTopics: ['approvals', 'reports', 'messages'],
    installBanner: true,
    mfaRequired: true,
    biometricEnabled: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleTopic = (topic: string) => {
    setSettings(prev => ({
      ...prev,
      defaultTopics: prev.defaultTopics.includes(topic)
        ? prev.defaultTopics.filter(t => t !== topic)
        : [...prev.defaultTopics, topic],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Default Topics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.defaultTopics[locale]}</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                settings.defaultTopics.includes(topic)
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 space-y-4">
        {[
          { key: 'installBanner', label: labels.installBanner },
          { key: 'mfaRequired', label: labels.mfaRequired },
          { key: 'biometricEnabled', label: labels.biometric },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm text-stone-700">{item.label[locale]}</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof settings] }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings[item.key as keyof typeof settings] ? 'bg-emerald-500' : 'bg-stone-300'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings[item.key as keyof typeof settings] ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 disabled:opacity-60"
      >
        {saving ? labels.saving[locale] : saved ? labels.saved[locale] : labels.save[locale]}
      </button>
    </div>
  );
}

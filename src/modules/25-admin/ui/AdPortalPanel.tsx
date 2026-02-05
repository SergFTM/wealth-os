'use client';

/**
 * Admin Portal Panel Component
 * Configure client portal settings
 */

import { useState } from 'react';
import { PortalConfig, PortalModule, portalModuleLabels, ALL_PORTAL_MODULES } from '../schema/portalConfig';

interface AdPortalPanelProps {
  config: PortalConfig | null;
  onSave: (config: Partial<PortalConfig>) => Promise<void>;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  portalEnabled: { ru: 'Портал клиента включен', en: 'Client Portal Enabled', uk: 'Портал клієнта увімкнено' },
  allowedModules: { ru: 'Доступные модули', en: 'Allowed Modules', uk: 'Доступні модулі' },
  clientSafe: { ru: 'Client Safe по умолчанию', en: 'Client Safe Default', uk: 'Client Safe за замовчуванням' },
  publishedOnly: { ru: 'Только опубликованные пакеты', en: 'Published Packs Only', uk: 'Тільки опубліковані пакети' },
  welcomeMessage: { ru: 'Приветственное сообщение', en: 'Welcome Message', uk: 'Привітальне повідомлення' },
  showWelcome: { ru: 'Показывать приветствие', en: 'Show Welcome', uk: 'Показувати привітання' },
  messageRu: { ru: 'Сообщение (RU)', en: 'Message (RU)', uk: 'Повідомлення (RU)' },
  messageEn: { ru: 'Сообщение (EN)', en: 'Message (EN)', uk: 'Повідомлення (EN)' },
  messageUk: { ru: 'Сообщение (UK)', en: 'Message (UK)', uk: 'Повідомлення (UK)' },
  save: { ru: 'Сохранить настройки портала', en: 'Save Portal Settings', uk: 'Зберегти налаштування порталу' },
};

export function AdPortalPanel({ config, onSave, lang = 'ru' }: AdPortalPanelProps) {
  const [portalEnabled, setPortalEnabled] = useState(config?.portalEnabled ?? true);
  const [allowedModules, setAllowedModules] = useState<PortalModule[]>(config?.allowedModules || []);
  const [clientSafeDefault, setClientSafeDefault] = useState(config?.clientSafeDefault ?? true);
  const [showOnlyPublishedPacks, setShowOnlyPublishedPacks] = useState(config?.showOnlyPublishedPacks ?? true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(config?.showWelcomeMessage ?? false);
  const [welcomeMessageRu, setWelcomeMessageRu] = useState(config?.welcomeMessageRu || '');
  const [welcomeMessageEn, setWelcomeMessageEn] = useState(config?.welcomeMessageEn || '');
  const [welcomeMessageUk, setWelcomeMessageUk] = useState(config?.welcomeMessageUk || '');
  const [saving, setSaving] = useState(false);

  const toggleModule = (module: PortalModule) => {
    setAllowedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        portalEnabled,
        allowedModules,
        clientSafeDefault,
        showOnlyPublishedPacks,
        showWelcomeMessage,
        welcomeMessageRu,
        welcomeMessageEn,
        welcomeMessageUk,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Enabled Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium">{labels.portalEnabled[lang]}</div>
          <div className="text-sm text-gray-500">
            {lang === 'ru' && 'Включите для доступа клиентов к порталу'}
            {lang === 'en' && 'Enable client access to portal'}
            {lang === 'uk' && 'Увімкніть для доступу клієнтів до порталу'}
          </div>
        </div>
        <button
          onClick={() => setPortalEnabled(!portalEnabled)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            portalEnabled ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              portalEnabled ? 'left-8' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Allowed Modules */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {labels.allowedModules[lang]}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ALL_PORTAL_MODULES.map(module => (
            <label
              key={module}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                allowedModules.includes(module)
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={allowedModules.includes(module)}
                onChange={() => toggleModule(module)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm">{portalModuleLabels[module][lang]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={clientSafeDefault}
            onChange={e => setClientSafeDefault(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className="text-sm">{labels.clientSafe[lang]}</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyPublishedPacks}
            onChange={e => setShowOnlyPublishedPacks(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className="text-sm">{labels.publishedOnly[lang]}</span>
        </label>
      </div>

      {/* Welcome Message */}
      <div className="border-t pt-6">
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={showWelcomeMessage}
            onChange={e => setShowWelcomeMessage(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className="text-sm font-medium">{labels.showWelcome[lang]}</span>
        </label>

        {showWelcomeMessage && (
          <div className="space-y-4 pl-7">
            <div>
              <label className="block text-xs text-gray-600 mb-1">{labels.messageRu[lang]}</label>
              <textarea
                value={welcomeMessageRu}
                onChange={e => setWelcomeMessageRu(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">{labels.messageEn[lang]}</label>
              <textarea
                value={welcomeMessageEn}
                onChange={e => setWelcomeMessageEn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">{labels.messageUk[lang]}</label>
              <textarea
                value={welcomeMessageUk}
                onChange={e => setWelcomeMessageUk(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '...' : labels.save[lang]}
        </button>
      </div>
    </div>
  );
}

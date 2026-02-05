'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Locale } from '@/lib/i18n';

const labels = {
  language: { ru: 'Язык', en: 'Language', uk: 'Мова' },
  currency: { ru: 'Валюта отображения', en: 'Display Currency', uk: 'Валюта відображення' },
  notifications: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення' },
  emailNotifications: { ru: 'Email уведомления', en: 'Email notifications', uk: 'Email сповіщення' },
  requestUpdates: { ru: 'Обновления запросов', en: 'Request updates', uk: 'Оновлення запитів' },
  reportPublished: { ru: 'Новые отчеты', en: 'New reports', uk: 'Нові звіти' },
  documentAdded: { ru: 'Новые документы', en: 'New documents', uk: 'Нові документи' },
  invoiceIssued: { ru: 'Новые счета', en: 'New invoices', uk: 'Нові рахунки' },
  messageReceived: { ru: 'Новые сообщения', en: 'New messages', uk: 'Нові повідомлення' },
  privacy: { ru: 'Конфиденциальность', en: 'Privacy', uk: 'Конфіденційність' },
  hideBalances: { ru: 'Скрыть баланс от других членов семьи', en: 'Hide balance from other family members', uk: 'Сховати баланс від інших членів сім\'ї' },
  saved: { ru: 'Сохранено', en: 'Saved', uk: 'Збережено' },
};

const languages: { code: Locale; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
];

const currencies = ['USD', 'EUR', 'GBP', 'CHF', 'RUB', 'UAH'];

export function PtPreferencesPanel() {
  const { locale, setLocale } = useApp();
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    requestUpdates: true,
    reportPublished: true,
    documentAdded: true,
    invoiceIssued: true,
    messageReceived: true,
  });
  const [hideBalances, setHideBalances] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLanguageChange = (lang: Locale) => {
    setLocale(lang);
    showSaved();
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    showSaved();
  };

  return (
    <div className="space-y-6">
      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {labels.language[locale]}
        </label>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                locale === lang.code
                  ? 'bg-emerald-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {labels.currency[locale]}
        </label>
        <div className="flex gap-2 flex-wrap">
          {currencies.map((curr) => (
            <button
              key={curr}
              onClick={() => handleCurrencyChange(curr)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                currency === curr
                  ? 'bg-emerald-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          {labels.notifications[locale]}
        </label>
        <div className="space-y-3">
          {/* Email toggle */}
          <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl cursor-pointer">
            <span className="text-sm text-stone-700">{labels.emailNotifications[locale]}</span>
            <div
              onClick={() => handleToggle('emailEnabled')}
              className={`w-11 h-6 rounded-full relative transition-colors ${
                notifications.emailEnabled ? 'bg-emerald-500' : 'bg-stone-300'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                notifications.emailEnabled ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>

          {notifications.emailEnabled && (
            <div className="ml-4 space-y-2">
              {([
                ['requestUpdates', labels.requestUpdates],
                ['reportPublished', labels.reportPublished],
                ['documentAdded', labels.documentAdded],
                ['invoiceIssued', labels.invoiceIssued],
                ['messageReceived', labels.messageReceived],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={() => handleToggle(key)}
                    className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-stone-600">{label[locale]}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Privacy */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          {labels.privacy[locale]}
        </label>
        <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl cursor-pointer">
          <span className="text-sm text-stone-700">{labels.hideBalances[locale]}</span>
          <div
            onClick={() => { setHideBalances(!hideBalances); showSaved(); }}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              hideBalances ? 'bg-emerald-500' : 'bg-stone-300'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              hideBalances ? 'translate-x-5' : ''
            }`} />
          </div>
        </label>
      </div>

      {/* Saved indicator */}
      {saved && (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {labels.saved[locale]}
        </div>
      )}
    </div>
  );
}

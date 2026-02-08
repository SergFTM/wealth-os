'use client';

import React, { useState } from 'react';
import { Locale, PortalPreferences } from '../types';
import { PCard, PCardHeader, PCardBody } from './PCard';

interface PSettingsProps {
  preferences: PortalPreferences;
  locale?: Locale;
  onSave?: (preferences: Partial<PortalPreferences>) => void;
  onLanguageChange?: (language: Locale) => void;
}

export function PSettings({ preferences, locale = 'ru', onSave, onLanguageChange }: PSettingsProps) {
  const [language, setLanguage] = useState<Locale>(preferences.language);
  const [emailNotifications, setEmailNotifications] = useState(preferences.emailNotifications);
  const [pushNotifications, setPushNotifications] = useState(preferences.pushNotifications);
  const [digestFrequency, setDigestFrequency] = useState(preferences.digestFrequency);

  const labels: Record<string, Record<Locale, string>> = {
    title: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування' },
    profile: { ru: 'Профиль', en: 'Profile', uk: 'Профіль' },
    language: { ru: 'Язык интерфейса', en: 'Interface Language', uk: 'Мова інтерфейсу' },
    notifications: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення' },
    emailNotifications: { ru: 'Email-уведомления', en: 'Email Notifications', uk: 'Email-сповіщення' },
    emailNotificationsDesc: { ru: 'Получать важные уведомления на email', en: 'Receive important notifications via email', uk: 'Отримувати важливі сповіщення на email' },
    pushNotifications: { ru: 'Push-уведомления', en: 'Push Notifications', uk: 'Push-сповіщення' },
    pushNotificationsDesc: { ru: 'Получать уведомления в браузере', en: 'Receive notifications in browser', uk: 'Отримувати сповіщення у браузері' },
    digestFrequency: { ru: 'Частота дайджеста', en: 'Digest Frequency', uk: 'Частота дайджесту' },
    digestDaily: { ru: 'Ежедневно', en: 'Daily', uk: 'Щоденно' },
    digestWeekly: { ru: 'Еженедельно', en: 'Weekly', uk: 'Щотижня' },
    digestMonthly: { ru: 'Ежемесячно', en: 'Monthly', uk: 'Щомісяця' },
    digestNone: { ru: 'Не получать', en: 'None', uk: 'Не отримувати' },
    save: { ru: 'Сохранить изменения', en: 'Save Changes', uk: 'Зберегти зміни' },
    saved: { ru: 'Сохранено', en: 'Saved', uk: 'Збережено' },
    security: { ru: 'Безопасность', en: 'Security', uk: 'Безпека' },
    changePassword: { ru: 'Изменить пароль', en: 'Change Password', uk: 'Змінити пароль' },
    twoFactor: { ru: 'Двухфакторная аутентификация', en: 'Two-Factor Authentication', uk: 'Двофакторна автентифікація' },
    twoFactorEnabled: { ru: 'Включена', en: 'Enabled', uk: 'Увімкнено' },
    sessions: { ru: 'Активные сессии', en: 'Active Sessions', uk: 'Активні сесії' },
    currentSession: { ru: 'Текущая сессия', en: 'Current Session', uk: 'Поточна сесія' },
    about: { ru: 'О портале', en: 'About Portal', uk: 'Про портал' },
    version: { ru: 'Версия', en: 'Version', uk: 'Версія' },
    support: { ru: 'Поддержка', en: 'Support', uk: 'Підтримка' },
    privacyPolicy: { ru: 'Политика конфиденциальности', en: 'Privacy Policy', uk: 'Політика конфіденційності' },
    termsOfService: { ru: 'Условия использования', en: 'Terms of Service', uk: 'Умови використання' },
  };

  const handleSave = () => {
    onSave?.({
      language,
      emailNotifications,
      pushNotifications,
      digestFrequency,
    });
  };

  const handleLanguageChange = (newLanguage: Locale) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className="space-y-6">
      {/* Language */}
      <PCard>
        <PCardHeader title={labels.language[locale]} />
        <PCardBody>
          <div className="flex gap-3">
            {(['ru', 'en', 'uk'] as Locale[]).map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  language === lang
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : 'Українська'}
              </button>
            ))}
          </div>
        </PCardBody>
      </PCard>

      {/* Notifications */}
      <PCard>
        <PCardHeader title={labels.notifications[locale]} />
        <PCardBody>
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">{labels.emailNotifications[locale]}</p>
                <p className="text-sm text-slate-500 mt-0.5">{labels.emailNotificationsDesc[locale]}</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  emailNotifications ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Push */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">{labels.pushNotifications[locale]}</p>
                <p className="text-sm text-slate-500 mt-0.5">{labels.pushNotificationsDesc[locale]}</p>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  pushNotifications ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Digest Frequency */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="font-medium text-slate-800 mb-3">{labels.digestFrequency[locale]}</p>
              <div className="grid grid-cols-4 gap-2">
                {(['daily', 'weekly', 'monthly', 'none'] as const).map(freq => (
                  <button
                    key={freq}
                    onClick={() => setDigestFrequency(freq)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      digestFrequency === freq
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {labels[`digest${freq.charAt(0).toUpperCase() + freq.slice(1)}` as keyof typeof labels]?.[locale]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PCardBody>
      </PCard>

      {/* Security */}
      <PCard>
        <PCardHeader title={labels.security[locale]} />
        <PCardBody>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <span className="font-medium text-slate-700">{labels.changePassword[locale]}</span>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-slate-700">{labels.twoFactor[locale]}</span>
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                    {labels.twoFactorEnabled[locale]}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-slate-700">{labels.sessions[locale]}</span>
              </div>
              <div className="ml-13 p-3 bg-white rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm text-slate-700">{labels.currentSession[locale]}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-4">Windows • Chrome • Moscow</p>
              </div>
            </div>
          </div>
        </PCardBody>
      </PCard>

      {/* About */}
      <PCard>
        <PCardHeader title={labels.about[locale]} />
        <PCardBody>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">{labels.version[locale]}</span>
              <span className="font-mono text-slate-800">1.0.0</span>
            </div>
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <span className="text-slate-600">{labels.support[locale]}</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <span className="text-slate-600">{labels.privacyPolicy[locale]}</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <span className="text-slate-600">{labels.termsOfService[locale]}</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </PCardBody>
      </PCard>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
      >
        {labels.save[locale]}
      </button>
    </div>
  );
}

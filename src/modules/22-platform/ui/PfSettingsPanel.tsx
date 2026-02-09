"use client";

import { useApp } from "@/lib/store";
import { DisplayLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function PfSettingsPanel() {
  const { locale, displayLocale, theme, toggleTheme, setLocale } = useApp();

  const t = {
    title: locale === "ru" ? "Настройки платформы" : "Platform Settings",
    appearance: locale === "ru" ? "Внешний вид" : "Appearance",
    theme: locale === "ru" ? "Тема" : "Theme",
    light: locale === "ru" ? "Светлая" : "Light",
    dark: locale === "ru" ? "Тёмная" : "Dark",
    language: locale === "ru" ? "Язык интерфейса" : "Interface Language",
    regional: locale === "ru" ? "Региональные настройки" : "Regional Settings",
    dateFormat: locale === "ru" ? "Формат даты" : "Date Format",
    numberFormat: locale === "ru" ? "Формат чисел" : "Number Format",
    currency: locale === "ru" ? "Валюта по умолчанию" : "Default Currency",
    notifications: locale === "ru" ? "Уведомления" : "Notifications",
    emailNotifications: locale === "ru" ? "Email уведомления" : "Email Notifications",
    pushNotifications: locale === "ru" ? "Push уведомления" : "Push Notifications",
    digestFrequency: locale === "ru" ? "Частота дайджеста" : "Digest Frequency",
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "uk", label: "Українська" },
    { code: "es", label: "Espanol" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
    { code: "fr", label: "Francais" },
    { code: "el", label: "Ellinika" },
  ];

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">{t.appearance}</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-600 mb-2 block">{t.theme}</label>
            <div className="flex gap-3">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg border-2 transition-all",
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-stone-200 hover:border-stone-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-stone-800">{t.light}</span>
                </div>
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg border-2 transition-all",
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-stone-200 hover:border-stone-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span className="font-medium text-stone-800">{t.dark}</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-600 mb-2 block">{t.language}</label>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code as DisplayLocale)}
                  className={cn(
                    "px-4 py-2 rounded-lg border transition-all",
                    displayLocale === lang.code
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 hover:border-stone-300 text-stone-600"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">{t.regional}</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-stone-600 mb-2 block">{t.dateFormat}</label>
            <select className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm">
              <option>DD.MM.YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-stone-600 mb-2 block">{t.numberFormat}</label>
            <select className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm">
              <option>1 234 567,89</option>
              <option>1,234,567.89</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-stone-600 mb-2 block">{t.currency}</label>
            <select className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>RUB (₽)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">{t.notifications}</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-stone-600">{t.emailNotifications}</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-stone-300 text-emerald-500 focus:ring-emerald-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-stone-600">{t.pushNotifications}</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-stone-300 text-emerald-500 focus:ring-emerald-500" />
          </label>
          <div>
            <label className="text-sm font-medium text-stone-600 mb-2 block">{t.digestFrequency}</label>
            <select className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm">
              <option>{locale === "ru" ? "Ежедневно" : "Daily"}</option>
              <option>{locale === "ru" ? "Еженедельно" : "Weekly"}</option>
              <option>{locale === "ru" ? "Никогда" : "Never"}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

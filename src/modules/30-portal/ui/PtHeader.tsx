'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { DisplayLocale, lm } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const labels = {
  search: lm({ en: 'Search portal...', ru: 'Поиск по порталу...', uk: 'Пошук по порталу...' }),
  notifications: lm({ en: 'Notifications', ru: 'Уведомления', uk: 'Сповіщення' }),
  profile: lm({ en: 'Profile', ru: 'Профиль', uk: 'Профіль' }),
  settings: lm({ en: 'Settings', ru: 'Настройки', uk: 'Налаштування' }),
  logout: lm({ en: 'Logout', ru: 'Выход', uk: 'Вихід' }),
  asOf: lm({ en: 'As of', ru: 'Данные на', uk: 'Дані на' }),
};

export function PtHeader() {
  const { locale, displayLocale, setLocale, user, logout, asOfDate } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const languages: { code: DisplayLocale; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
    { code: 'es', label: 'Espanol' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'fr', label: 'Francais' },
    { code: 'el', label: 'Ellinika' },
  ];

  const notifications = [
    { id: '1', title: locale === 'ru' ? 'Новый отчет опубликован' : 'New report published', time: '5 мин' },
    { id: '2', title: locale === 'ru' ? 'Запрос обновлен' : 'Request updated', time: '1 час' },
  ];

  return (
    <header className="h-16 border-b border-emerald-100/50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={labels.search[locale]}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-emerald-100 bg-white/50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* As-of badge */}
        <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-100/50 text-xs font-medium text-emerald-700">
          {labels.asOf[locale]}: {new Date(asOfDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-stone-500 hover:bg-emerald-50 transition-all relative"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-emerald-100 z-50 overflow-hidden">
                <div className="p-3 border-b border-emerald-50 font-medium text-sm text-stone-800">
                  {labels.notifications[locale]}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-emerald-50/50 border-b border-emerald-50/50 last:border-0">
                      <div className="text-sm font-medium text-stone-800">{n.title}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Language */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-emerald-50 transition-all"
          >
            {displayLocale.toUpperCase()}
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-emerald-100 z-50 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setShowLangMenu(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50",
                      displayLocale === lang.code && "bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emerald-50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-emerald-100 z-50 overflow-hidden">
                <div className="p-3 border-b border-emerald-50">
                  <div className="font-medium text-sm text-stone-800">{user?.name}</div>
                  <div className="text-xs text-stone-400 capitalize">{user?.role}</div>
                </div>
                <div className="py-1">
                  <Link
                    href="/portal/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-stone-600 hover:bg-emerald-50"
                  >
                    {labels.profile[locale]}
                  </Link>
                  <div className="border-t border-emerald-50 my-1" />
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    {labels.logout[locale]}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

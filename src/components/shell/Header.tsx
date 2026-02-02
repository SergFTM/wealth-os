"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Locale } from "@/lib/i18n";
import Link from "next/link";
import { initDemoData } from "@/lib/apiClient";

export function Header() {
  const { t, locale, setLocale, user, logout, openCopilot, openCreateModal } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const languages: { code: Locale; label: string }[] = [
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
    { code: 'uk', label: 'Українська' },
  ];

  const notifications = [
    { id: '1', title: 'Новый IPS breach', time: '5 мин назад', type: 'critical' },
    { id: '2', title: 'Задача просрочена', time: '1 час назад', type: 'warning' },
    { id: '3', title: 'Синхронизация завершена', time: '2 часа назад', type: 'info' },
  ];

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await initDemoData();
      alert('Демо данные инициализированы');
    } catch {
      alert('Ошибка инициализации');
    } finally {
      setSeeding(false);
      setShowUserMenu(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className="h-16 border-b border-stone-200/50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.common.search + '...'}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm" onClick={() => openCreateModal()}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.common.create}
        </Button>

        <button
          onClick={() => openCopilot()}
          className="p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-amber-50 text-emerald-600 hover:from-emerald-100 hover:to-amber-100 transition-all"
          title="AI Copilot"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-all relative"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-stone-100 font-medium text-sm">{t.common.notifications}</div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-stone-50 border-b border-stone-50 last:border-0">
                      <div className="text-sm font-medium text-stone-800">{n.title}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-all"
          >
            {locale.toUpperCase()}
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setShowLangMenu(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-stone-50",
                      locale === lang.code && "bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-stone-100">
                  <div className="font-medium text-sm text-stone-800">{user?.name}</div>
                  <div className="text-xs text-stone-400 capitalize">{user?.role}</div>
                </div>
                <div className="py-1">
                  <Link href="/m/dashboard-home" className="block px-4 py-2 text-sm text-stone-600 hover:bg-stone-50">
                    {locale === 'ru' ? 'Профиль' : 'Profile'}
                  </Link>
                  <Link href="/m/dashboard-home" className="block px-4 py-2 text-sm text-stone-600 hover:bg-stone-50">
                    {locale === 'ru' ? 'Настройки' : 'Settings'}
                  </Link>
                  
                  {isAdmin && (
                    <>
                      <div className="border-t border-stone-100 my-1" />
                      <div className="px-4 py-2 text-xs text-stone-400 uppercase tracking-wide">Admin</div>
                      <button 
                        onClick={handleSeed}
                        disabled={seeding}
                        className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                      >
                        {seeding ? 'Инициализация...' : 'Инициализировать данные'}
                      </button>
                    </>
                  )}
                  
                  <div className="border-t border-stone-100 my-1" />
                  <div className="px-4 py-2 text-xs text-stone-400 uppercase tracking-wide">Security</div>
                  <button className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 flex items-center justify-between">
                    <span>MFA Status</span>
                    <span className="text-xs text-emerald-600 font-medium">Enabled</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 flex items-center justify-between">
                    <span>Active Sessions</span>
                    <span className="text-xs text-stone-500">2</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50">
                    View Audit Log
                  </button>
                  <div className="border-t border-stone-100 my-1" />
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">{t.common.logout}</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

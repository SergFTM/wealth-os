"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { DisplayLocale } from "@/lib/i18n";
import Link from "next/link";
import { initDemoData } from "@/lib/apiClient";
import { SIDEBAR_CLUSTERS, HEADER_CLUSTER_IDS } from "@/modules/clusters";

type Environment = 'production' | 'sandbox';

function getEnvFromStorage(): Environment {
  if (typeof window === 'undefined') return 'production';
  return (sessionStorage.getItem('wealthos_env') as Environment) || 'production';
}

function setEnvToStorage(env: Environment): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('wealthos_env', env);
}

export function Header() {
  const { t, locale, displayLocale, setLocale, theme, toggleTheme, user, logout, toggleAiPanel, aiPanelOpen, openCreateModal, activeCluster, setActiveCluster } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [currentEnv, setCurrentEnv] = useState<Environment>('production');

  useEffect(() => {
    setCurrentEnv(getEnvFromStorage());
  }, []);

  const toggleEnvironment = () => {
    const newEnv = currentEnv === 'production' ? 'sandbox' : 'production';
    setEnvToStorage(newEnv);
    setCurrentEnv(newEnv);
  };

  const isSandbox = currentEnv === 'sandbox';

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
    <header className="h-16 border-b border-border/50 bg-card/60 dark:bg-card/40 backdrop-blur-xl flex items-center justify-between px-6 transition-colors duration-300 relative z-50">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.common.search + '...'}
            className="w-full pl-10 pr-4 py-2 glass-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Cluster Navigation */}
      <nav className="hidden lg:flex items-center gap-1 px-4 flex-shrink-0">
        {HEADER_CLUSTER_IDS.map((id) => {
          const cluster = SIDEBAR_CLUSTERS.find(c => c.id === id)!;
          const isActive = activeCluster === id;
          return (
            <button
              key={id}
              onClick={() => setActiveCluster(id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-gradient-to-r from-primary/15 to-secondary/15 text-primary shadow-sm border border-primary/10"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              title={cluster.label[locale]}
            >
              {cluster.shortLabel?.[locale] ?? cluster.label[locale]}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        {/* Environment Switcher */}
        <div className="flex items-center gap-2">
          {isSandbox && (
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500 text-white animate-pulse">
              SANDBOX
            </span>
          )}
          <button
            onClick={toggleEnvironment}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              isSandbox
                ? "bg-gradient-to-r from-primary to-secondary focus:ring-secondary"
                : "bg-muted focus:ring-muted"
            )}
            title={isSandbox ? (locale === 'ru' ? 'Песочница активна' : 'Sandbox active') : (locale === 'ru' ? 'Production режим' : 'Production mode')}
          >
            <span className="sr-only">Toggle environment</span>
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                isSandbox ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">
            {isSandbox ? (locale === 'ru' ? 'Песочница' : 'Sandbox') : (locale === 'ru' ? 'Production' : 'Production')}
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <Button variant="primary" size="sm" onClick={() => openCreateModal()}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.common.create}
        </Button>

        <button
          onClick={() => toggleAiPanel()}
          className={cn(
            "p-2 rounded-lg transition-all border",
            aiPanelOpen
              ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/20 shadow-sm"
              : "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20 border-primary/10"
          )}
          title="AI Insights"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all relative"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse shadow-sm shadow-destructive/50"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 glass-card z-50 overflow-hidden">
                <div className="p-3 border-b border-border font-medium text-sm text-foreground">{t.common.notifications}</div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-muted/50 border-b border-border/50 last:border-0 transition-colors">
                      <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{n.title}</div>
                      <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-all"
          title={theme === 'light' ? (locale === 'ru' ? 'Тёмная тема' : 'Dark mode') : (locale === 'ru' ? 'Светлая тема' : 'Light mode')}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-all"
          >
            {displayLocale.toUpperCase()}
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-40 glass-card z-50 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setShowLangMenu(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors",
                      displayLocale === lang.code && "bg-primary/10 text-primary font-medium"
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
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-medium text-sm shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 glass-card z-50 overflow-hidden">
                <div className="p-3 border-b border-border/50">
                  <div className="font-medium text-sm text-stone-800 dark:text-stone-200">{user?.name}</div>
                  <div className="text-xs text-stone-400 dark:text-stone-500 capitalize">{user?.role}</div>
                </div>
                <div className="py-1">
                  <Link href="/m/dashboard-home" className="block px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50">
                    {locale === 'ru' ? 'Профиль' : 'Profile'}
                  </Link>
                  <Link href="/m/dashboard-home" className="block px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50">
                    {locale === 'ru' ? 'Настройки' : 'Settings'}
                  </Link>

                  {isAdmin && (
                    <>
                      <div className="border-t border-stone-100 dark:border-stone-700 my-1" />
                      <div className="px-4 py-2 text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wide">Admin</div>
                      <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="w-full text-left px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50 disabled:opacity-50"
                      >
                        {seeding ? 'Инициализация...' : 'Инициализировать данные'}
                      </button>
                    </>
                  )}

                  <div className="border-t border-stone-100 dark:border-stone-700 my-1" />
                  <div className="px-4 py-2 text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wide">Security</div>
                  <button className="w-full text-left px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center justify-between">
                    <span>MFA Status</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Enabled</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center justify-between">
                    <span>Active Sessions</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">2</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50">
                    View Audit Log
                  </button>
                  <div className="border-t border-stone-100 dark:border-stone-700 my-1" />
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20">{t.common.logout}</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

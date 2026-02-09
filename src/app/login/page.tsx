"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/lib/data";
import { useState, useMemo, useRef, useEffect } from "react";
import { Locale, DisplayLocale, lm } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getVisibleModulesForRole } from "@/lib/hooks";
import { SLUG_TO_CLUSTER, SIDEBAR_CLUSTERS, HEADER_CLUSTER_IDS } from "@/modules/clusters";

/* ---------- static data ---------- */

const roles: {
  key: UserRole;
  label: Record<string, string>;
  description: Record<string, string>;
  icon: string;
}[] = [
  {
    key: "admin",
    label: lm({ en: "Administrator", ru: "Администратор", uk: "Адміністратор" }),
    description: lm({ en: "Full access to all modules", ru: "Полный доступ ко всем модулям", uk: "Повний доступ до всіх модулів" }),
    icon: "🔑",
  },
  {
    key: "cio",
    label: lm({ en: "CIO" }),
    description: lm({ en: "Investments & portfolios", ru: "Инвестиции и портфели", uk: "Інвестиції та портфелі" }),
    icon: "📈",
  },
  {
    key: "cfo",
    label: lm({ en: "CFO" }),
    description: lm({ en: "Finance & billing", ru: "Финансы и биллинг", uk: "Фінанси та білінг" }),
    icon: "💰",
  },
  {
    key: "operations",
    label: lm({ en: "Operations" }),
    description: lm({ en: "Operations & workflow", ru: "Операции и workflow", uk: "Операції та workflow" }),
    icon: "⚙️",
  },
  {
    key: "compliance",
    label: lm({ en: "Compliance" }),
    description: lm({ en: "Risk & compliance", ru: "Риски и соответствие", uk: "Ризики та відповідність" }),
    icon: "🛡️",
  },
  {
    key: "rm",
    label: lm({ en: "Relationship Manager" }),
    description: lm({ en: "Client relationships", ru: "Клиентские отношения", uk: "Клієнтські відносини" }),
    icon: "🤝",
  },
  {
    key: "advisor",
    label: lm({ en: "Advisor" }),
    description: lm({ en: "Client advisory", ru: "Консультирование клиентов", uk: "Консультування клієнтів" }),
    icon: "💼",
  },
  {
    key: "client",
    label: lm({ en: "Client", ru: "Клиент", uk: "Клієнт" }),
    description: lm({ en: "View own data", ru: "Просмотр своих данных", uk: "Перегляд своїх даних" }),
    icon: "👤",
  },
];

const featureDescriptions: Record<number, Record<string, string>> = {
  1: lm({ en: "Reconciliation, integrations, MDM", ru: "Сверка, интеграции, MDM", uk: "Звірка, інтеграції, MDM" }),
  2: lm({ en: "Net Worth, trusts, ownership", ru: "Net Worth, трасты, владение", uk: "Net Worth, трасти, володіння" }),
  3: lm({ en: "Performance, IPS, risk", ru: "Доходность, IPS, риск", uk: "Дохідність, IPS, ризик" }),
  4: lm({ en: "GL, tax, billing", ru: "GL, налоги, биллинг", uk: "GL, податки, білінг" }),
  5: lm({ en: "Reports, mail, calendar", ru: "Отчёты, почта, календарь", uk: "Звіти, пошта, календар" }),
  6: lm({ en: "KYC, AML, policies", ru: "KYC, AML, политики", uk: "KYC, AML, політики" }),
};

const featureIcons: Record<number, React.ReactNode> = {
  1: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  2: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>,
  3: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  4: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  5: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  6: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
};

/* ---------- AI chat types ---------- */

interface AiMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

/* ---------- helpers ---------- */

function getRoleClusterAccess(roleKey: UserRole): { moduleCount: number; clusterIds: Set<number> } {
  const slugs = getVisibleModulesForRole(roleKey, roleKey === "client");
  const clusterIds = new Set<number>();
  for (const s of slugs) {
    const cid = SLUG_TO_CLUSTER[s];
    if (cid !== undefined && cid >= 1 && cid <= 6) clusterIds.add(cid);
  }
  return { moduleCount: slugs.length, clusterIds };
}

/* ---------- page ---------- */

export default function LoginPage() {
  const router = useRouter();
  const { login, locale, displayLocale, setLocale, theme, toggleTheme, toggleAiPanel, aiPanelOpen } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [officeMode, setOfficeMode] = useState<'multi' | 'single'>('multi');
  const langRef = useRef<HTMLDivElement>(null);

  // AI chat state
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

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

  const roleAccess = useMemo(() => {
    const map: Record<string, { moduleCount: number; clusterIds: Set<number> }> = {};
    for (const r of roles) map[r.key] = getRoleClusterAccess(r.key);
    return map;
  }, []);

  const handleLogin = () => {
    login(selectedRole);
    router.push("/m/dashboard-home");
  };

  const handleAiSubmit = async (prompt?: string) => {
    const text = (prompt || aiQuery).trim();
    if (!text || aiLoading) return;
    const userMsg: AiMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
    };
    setAiMessages(prev => [...prev, userMsg]);
    setAiQuery("");
    setAiLoading(true);

    try {
      const resp = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, promptType: "general_query", context: { moduleKey: "platform", moduleName: "Wealth OS" } }),
      });
      const data = await resp.json();
      setAiMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: data.response || data.error || (locale === "ru" ? "Не удалось получить ответ" : "Failed to get response"),
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setAiMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: "ai",
        content: locale === "ru" ? "Ошибка обработки запроса." : "Error processing request.",
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const suggestedPrompts: { text: Record<string, string> }[] = [
    { text: lm({ en: "Platform capabilities overview", ru: "Обзор возможностей платформы", uk: "Огляд можливостей платформи" }) },
    { text: lm({ en: "Which modules are available for CIO?", ru: "Какие модули доступны для CIO?", uk: "Які модулі доступні для CIO?" }) },
    { text: lm({ en: "How does portfolio analytics work?", ru: "Как работает портфельная аналитика?", uk: "Як працює портфельна аналітика?" }) },
    { text: lm({ en: "Tell me about compliance modules", ru: "Расскажи о compliance модулях", uk: "Розкажи про compliance модулі" }) },
  ];

  const t = {
    subtitleMulti: lm({ en: "Wealth management platform for multi-family offices", ru: "Платформа управления состоянием для мультисемейных офисов", uk: "Платформа управління статками для мультисімейних офісів" }),
    subtitleSingle: lm({ en: "Wealth management platform for single family office", ru: "Платформа управления состоянием для семейного офиса", uk: "Платформа управління статками для сімейного офісу" }),
    features: lm({ en: "Platform capabilities", ru: "Возможности платформы", uk: "Можливості платформи" }),
    selectRole: lm({ en: "Select a role to sign in", ru: "Выберите роль для входа", uk: "Оберіть роль для входу" }),
    modules: lm({ en: "modules", ru: "модулей", uk: "модулів" }),
    login: lm({ en: "Sign In", ru: "Войти", uk: "Увійти" }),
    footer: lm({ en: "MVP Demo — For demonstration only", ru: "MVP Demo — Только для демонстрации", uk: "MVP Demo — Тільки для демонстрації" }),
    multi: lm({ en: "Multi Family" }),
    single: lm({ en: "Single Family" }),
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 dark:from-stone-950 dark:via-emerald-950/20 dark:to-amber-950/10">

      {/* ══ Main Content ══════════════════════════════ */}
      <div className={cn("flex-1 overflow-y-auto relative", aiPanelOpen && "hidden lg:block")}>

        {/* ── Top Bar ─────────────────────────── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
          {/* Logo — top left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-200 hidden sm:inline">Wealth OS</span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* AI Toggle */}
            <button
              onClick={() => toggleAiPanel()}
              className={cn(
                "p-2 rounded-lg transition-all border",
                aiPanelOpen
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/20 shadow-sm"
                  : "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20 border-primary/10"
              )}
              title="AI Copilot"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-all"
              title={theme === 'light' ? (locale === 'ru' ? 'Тёмная тема' : locale === 'uk' ? 'Темна тема' : 'Dark mode') : (locale === 'ru' ? 'Светлая тема' : locale === 'uk' ? 'Світла тема' : 'Light mode')}
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

            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-all"
              >
                {displayLocale.toUpperCase()}
              </button>

              {showLangMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white/90 dark:bg-stone-800/90 backdrop-blur-lg rounded-xl border border-stone-200/50 dark:border-stone-700/50 shadow-xl overflow-hidden z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); setShowLangMenu(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100/80 dark:hover:bg-stone-700/50 transition-colors",
                        displayLocale === lang.code && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-12 sm:pb-16">

          {/* ── Hero ─────────────────────────────────── */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
              Wealth OS
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 text-base sm:text-lg max-w-md mx-auto">
              {officeMode === 'multi' ? t.subtitleMulti[locale] : t.subtitleSingle[locale]}
            </p>

            {/* MFO / SFO Slider Toggle */}
            <div className="flex items-center justify-center gap-1 mt-5">
              <div className="relative inline-flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-0.5">
                <button
                  onClick={() => setOfficeMode('multi')}
                  className={cn(
                    "relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                    officeMode === 'multi'
                      ? "text-white"
                      : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                  )}
                >
                  {t.multi[locale]}
                </button>
                <button
                  onClick={() => setOfficeMode('single')}
                  className={cn(
                    "relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                    officeMode === 'single'
                      ? "text-white"
                      : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                  )}
                >
                  {t.single[locale]}
                </button>
                {/* Sliding pill */}
                <div
                  className={cn(
                    "absolute top-0.5 bottom-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 shadow-md shadow-emerald-500/20 transition-all duration-300 ease-in-out",
                    officeMode === 'multi'
                      ? "left-0.5 w-[calc(50%-2px)]"
                      : "left-[calc(50%+2px)] w-[calc(50%-2px)]"
                  )}
                />
              </div>
            </div>
          </div>

          {/* ── Features Strip ──────────────────────── */}
          <div className="mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 text-center mb-4">
              {t.features[locale]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {HEADER_CLUSTER_IDS.map((id) => {
                const cluster = SIDEBAR_CLUSTERS.find((c) => c.id === id)!;
                return (
                  <div
                    key={id}
                    className="bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="text-emerald-600 dark:text-emerald-400 flex justify-center mb-2">
                      {featureIcons[id]}
                    </div>
                    <div className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                      {cluster.shortLabel?.[locale] ?? cluster.label[locale]}
                    </div>
                    <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 leading-tight">
                      {featureDescriptions[id]?.[locale]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Role Selection ─────────────────────── */}
          <div className="bg-white/80 dark:bg-stone-900/60 backdrop-blur-xl rounded-2xl border border-stone-200/50 dark:border-stone-700/50 shadow-xl p-6 sm:p-8">
            <h2 className="text-sm font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide mb-5 text-center">
              {t.selectRole[locale]}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roles.map((role) => {
                const access = roleAccess[role.key];
                const isSelected = selectedRole === role.key;
                return (
                  <button
                    key={role.key}
                    onClick={() => setSelectedRole(role.key)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-emerald-500 dark:border-emerald-400 bg-gradient-to-br from-emerald-50 to-amber-50/50 dark:from-emerald-950/40 dark:to-amber-950/20 shadow-md shadow-emerald-500/10"
                        : "border-stone-200/80 dark:border-stone-700/80 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50/50 dark:hover:bg-stone-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{role.icon}</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-100 text-sm">{role.label[locale]}</span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                      {role.description[locale]}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        {access.moduleCount} {t.modules[locale]}
                      </span>
                      <div className="flex gap-1">
                        {HEADER_CLUSTER_IDS.map((cid) => (
                          <span
                            key={cid}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              access.clusterIds.has(cid)
                                ? "bg-emerald-500 dark:bg-emerald-400"
                                : "bg-stone-200 dark:bg-stone-700"
                            }`}
                            title={SIDEBAR_CLUSTERS.find((c) => c.id === cid)?.shortLabel?.[locale]}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              className="mt-6 w-full max-w-xs mx-auto block !bg-gradient-to-r !from-emerald-500 !to-amber-500 hover:!from-emerald-600 hover:!to-amber-600 !shadow-lg !shadow-emerald-500/20 text-white"
              onClick={handleLogin}
            >
              {t.login[locale]}
            </Button>
          </div>

          {/* ── Footer ─────────────────────────────── */}
          <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-4">
            {t.footer[locale]}
          </p>
        </div>
      </div>

      {/* ══ AI Panel (inline, part of layout) ══════════ */}
      {aiPanelOpen && (
        <div className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 h-screen sticky top-0 border-l border-stone-200/30 dark:border-stone-700/30 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl flex flex-col">

          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200/30 dark:border-stone-700/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">AI Copilot</div>
                <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">Wealth OS</div>
              </div>
            </div>
            <button
              onClick={() => toggleAiPanel()}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {aiMessages.length === 0 ? (
              /* Empty state — centered branding */
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 dark:from-violet-500/10 dark:to-indigo-600/10 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100 mb-1">
                  {locale === 'ru' ? 'Чем могу помочь?' : locale === 'uk' ? 'Чим можу допомогти?' : 'How can I help?'}
                </h3>
                <p className="text-xs text-stone-400 dark:text-stone-500 max-w-[260px] leading-relaxed">
                  {locale === 'ru' ? 'Задайте вопрос о платформе, модулях или возможностях Wealth OS' : locale === 'uk' ? 'Задайте питання про платформу, модулі або можливості Wealth OS' : 'Ask about the platform, modules, or Wealth OS capabilities'}
                </p>
              </div>
            ) : (
              /* Chat messages */
              <div className="space-y-3">
                {aiMessages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-md"
                    )}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className={cn(
                        "text-[10px] mt-1.5",
                        msg.role === "user" ? "text-primary-foreground/60" : "text-stone-400 dark:text-stone-500"
                      )}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-stone-100 dark:bg-stone-800 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input + Suggested Prompts */}
          <div className="px-5 pb-5 pt-2 border-t border-stone-200/30 dark:border-stone-700/30">
            {/* Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAiSubmit()}
                placeholder={locale === 'ru' ? 'Спросите о платформе...' : locale === 'uk' ? 'Запитайте про платформу...' : 'Ask about the platform...'}
                disabled={aiLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200/60 dark:border-stone-700/60 bg-white/60 dark:bg-stone-800/60 text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 disabled:opacity-50 transition-all"
              />
              <button
                onClick={() => handleAiSubmit()}
                disabled={aiLoading || !aiQuery.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white disabled:opacity-40 hover:from-violet-600 hover:to-indigo-700 transition-all flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleAiSubmit(p.text[locale])}
                  disabled={aiLoading}
                  className="px-3 py-1.5 rounded-lg text-xs text-stone-500 dark:text-stone-400 bg-stone-100/80 dark:bg-stone-800/60 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 border border-stone-200/50 dark:border-stone-700/50 hover:border-violet-200 dark:hover:border-violet-800/50 transition-all disabled:opacity-40"
                >
                  {p.text[locale]}
                </button>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-3 text-center leading-relaxed">
              {locale === 'ru' ? 'AI выводы информационные и требуют проверки' : locale === 'uk' ? 'AI висновки інформаційні та потребують перевірки' : 'AI outputs are informational and require verification'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

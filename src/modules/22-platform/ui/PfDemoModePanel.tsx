"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface PfDemoModePanelProps {
  demoInitialized: boolean;
  seedProfile: string;
  onInitDemo: () => Promise<void>;
  onResetDemo: () => Promise<void>;
  onGenerateEvents: (type: "daily" | "monthEnd" | "audit") => Promise<void>;
}

export function PfDemoModePanel({
  demoInitialized,
  seedProfile,
  onInitDemo,
  onResetDemo,
  onGenerateEvents,
}: PfDemoModePanelProps) {
  const { locale } = useApp();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string, fn: () => Promise<void>) => {
    setLoading(action);
    try {
      await fn();
    } finally {
      setLoading(null);
    }
  };

  const t = {
    title: locale === "ru" ? "Управление демо данными" : "Demo Data Management",
    initDemo: locale === "ru" ? "Инициализировать демо данные" : "Initialize Demo Data",
    resetDemo: locale === "ru" ? "Сбросить демо данные" : "Reset Demo Data",
    generateDaily: locale === "ru" ? "Сгенерировать ежедневные события" : "Generate Daily Events",
    generateMonthEnd: locale === "ru" ? "Сгенерировать конец месяца" : "Generate Month End",
    generateAudit: locale === "ru" ? "Сгенерировать активность аудита" : "Generate Audit Burst",
    profile: locale === "ru" ? "Профиль seed" : "Seed Profile",
    status: locale === "ru" ? "Статус" : "Status",
    initialized: locale === "ru" ? "Инициализировано" : "Initialized",
    notInitialized: locale === "ru" ? "Не инициализировано" : "Not Initialized",
    loading: locale === "ru" ? "Загрузка..." : "Loading...",
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">{t.title}</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-stone-50 rounded-lg">
          <div className="text-sm text-stone-500 mb-1">{t.status}</div>
          <div className={cn(
            "font-medium",
            demoInitialized ? "text-emerald-600" : "text-amber-600"
          )}>
            {demoInitialized ? t.initialized : t.notInitialized}
          </div>
        </div>
        <div className="p-4 bg-stone-50 rounded-lg">
          <div className="text-sm text-stone-500 mb-1">{t.profile}</div>
          <div className="font-medium text-stone-800 capitalize">{seedProfile || "medium"}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={() => handleAction("init", onInitDemo)}
            disabled={loading !== null || demoInitialized}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg font-medium transition-all",
              demoInitialized
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm"
            )}
          >
            {loading === "init" ? t.loading : t.initDemo}
          </button>
          <button
            onClick={() => handleAction("reset", onResetDemo)}
            disabled={loading !== null || !demoInitialized}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg font-medium transition-all",
              !demoInitialized
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
            )}
          >
            {loading === "reset" ? t.loading : t.resetDemo}
          </button>
        </div>

        <div className="border-t border-stone-200 pt-4 mt-4">
          <div className="text-sm font-medium text-stone-600 mb-3">
            {locale === "ru" ? "Генерация событий" : "Event Generation"}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleAction("daily", () => onGenerateEvents("daily"))}
              disabled={loading !== null || !demoInitialized}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading === "daily" ? "..." : t.generateDaily}
            </button>
            <button
              onClick={() => handleAction("monthEnd", () => onGenerateEvents("monthEnd"))}
              disabled={loading !== null || !demoInitialized}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading === "monthEnd" ? "..." : t.generateMonthEnd}
            </button>
            <button
              onClick={() => handleAction("audit", () => onGenerateEvents("audit"))}
              disabled={loading !== null || !demoInitialized}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading === "audit" ? "..." : t.generateAudit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

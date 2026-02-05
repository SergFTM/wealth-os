"use client";

import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface PfKpiStripProps {
  kpis: {
    demoInitialized: boolean;
    seedVersion: string;
    totalRecords: number;
    navHealth: number;
    openTasks: number;
    openAlerts: number;
    newNotifications: number;
    lastReset: string | null;
  };
  onKpiClick?: (key: string) => void;
}

export function PfKpiStrip({ kpis, onKpiClick }: PfKpiStripProps) {
  const { locale } = useApp();

  const cards = [
    {
      key: "demoInitialized",
      title: locale === "ru" ? "Демо активен" : "Demo Active",
      value: kpis.demoInitialized ? (locale === "ru" ? "Да" : "Yes") : (locale === "ru" ? "Нет" : "No"),
      status: kpis.demoInitialized ? "ok" : "warning",
      clickable: false,
    },
    {
      key: "seedVersion",
      title: locale === "ru" ? "Версия seed" : "Seed Version",
      value: kpis.seedVersion || "—",
      status: "ok",
      clickable: false,
    },
    {
      key: "totalRecords",
      title: locale === "ru" ? "Всего записей" : "Total Records",
      value: kpis.totalRecords.toLocaleString(),
      status: "ok",
      clickable: false,
    },
    {
      key: "navHealth",
      title: locale === "ru" ? "Навигация OK" : "Nav Health",
      value: `${kpis.navHealth}%`,
      status: kpis.navHealth === 100 ? "ok" : kpis.navHealth >= 90 ? "warning" : "critical",
      clickable: true,
    },
    {
      key: "openTasks",
      title: locale === "ru" ? "Открытые задачи" : "Open Tasks",
      value: kpis.openTasks.toString(),
      status: kpis.openTasks > 10 ? "warning" : "ok",
      clickable: true,
    },
    {
      key: "openAlerts",
      title: locale === "ru" ? "Открытые алерты" : "Open Alerts",
      value: kpis.openAlerts.toString(),
      status: kpis.openAlerts > 0 ? "critical" : "ok",
      clickable: true,
    },
    {
      key: "newNotifications",
      title: locale === "ru" ? "Уведомления" : "Notifications",
      value: kpis.newNotifications.toString(),
      status: kpis.newNotifications > 0 ? "warning" : "ok",
      clickable: true,
    },
    {
      key: "lastReset",
      title: locale === "ru" ? "Последний сброс" : "Last Reset",
      value: kpis.lastReset
        ? new Date(kpis.lastReset).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
            day: "numeric",
            month: "short",
          })
        : "—",
      status: "ok",
      clickable: false,
    },
  ];

  const statusColors: Record<string, string> = {
    ok: "bg-emerald-50 border-emerald-200 text-emerald-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    critical: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card) => (
        <button
          key={card.key}
          onClick={() => card.clickable && onKpiClick?.(card.key)}
          disabled={!card.clickable}
          className={cn(
            "p-4 rounded-xl border backdrop-blur-sm transition-all text-left",
            statusColors[card.status],
            card.clickable
              ? "hover:shadow-md hover:scale-[1.02] cursor-pointer"
              : "cursor-default opacity-90"
          )}
        >
          <div className="text-xs font-medium opacity-70 mb-1 truncate">{card.title}</div>
          <div className="text-lg font-semibold">{card.value}</div>
        </button>
      ))}
    </div>
  );
}

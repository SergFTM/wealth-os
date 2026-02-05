"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Breadcrumbs } from "@/components/global";
import {
  PfKpiStrip,
  PfDemoModePanel,
  PfPersonaSwitcher,
  PfSeedManager,
  PfActionsBar,
} from "@/modules/22-platform/ui";
import { UserRole } from "@/lib/data";

interface DemoState {
  demoInitialized: boolean;
  seedVersion: string;
  seedProfile: string;
  personaRole: string;
  lastResetAt: string | null;
  totalRecords: number;
  openTasks: number;
  openAlerts: number;
  unreadNotifications: number;
  navHealth: number;
}

export default function PlatformDashboardPage() {
  const { locale, login } = useApp();
  const router = useRouter();
  const [demoState, setDemoState] = useState<DemoState>({
    demoInitialized: false,
    seedVersion: "1.0.0",
    seedProfile: "medium",
    personaRole: "admin",
    lastResetAt: null,
    totalRecords: 0,
    openTasks: 0,
    openAlerts: 0,
    unreadNotifications: 0,
    navHealth: 100,
  });
  const [loading, setLoading] = useState(true);

  const fetchDemoState = useCallback(async () => {
    try {
      const res = await fetch("/api/platform/demo");
      const data = await res.json();
      setDemoState(data);
    } catch {
      console.error("Failed to fetch demo state");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemoState();
  }, [fetchDemoState]);

  const handleInitDemo = async () => {
    await fetch("/api/platform/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "init", payload: { profile: demoState.seedProfile } }),
    });
    await fetchDemoState();
  };

  const handleResetDemo = async () => {
    await fetch("/api/platform/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    await fetchDemoState();
  };

  const handleGenerateEvents = async (type: "daily" | "monthEnd" | "audit") => {
    await fetch("/api/platform/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate", payload: { type } }),
    });
    await fetchDemoState();
  };

  const handleRoleChange = async (role: UserRole) => {
    await fetch("/api/platform/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "persona", payload: { role } }),
    });
    login(role);
    await fetchDemoState();
  };

  const handleProfileChange = (profile: "small" | "medium" | "full") => {
    setDemoState((prev) => ({ ...prev, seedProfile: profile }));
  };

  const handleExportData = () => {
    alert(locale === "ru" ? "Экспорт данных (MVP заглушка)" : "Export data (MVP stub)");
  };

  const handleKpiClick = (key: string) => {
    if (key === "openTasks") router.push("/m/workflow/list");
    else if (key === "openAlerts") router.push("/m/risk/list");
    else if (key === "newNotifications") router.push("/m/platform/list?tab=notifications");
    else if (key === "navHealth") router.push("/m/platform/list?tab=navigation");
  };

  const t = {
    title: locale === "ru" ? "Платформа" : "Platform",
    subtitle: locale === "ru" ? "Демо режим и настройки платформы" : "Demo mode and platform settings",
    disclaimer: locale === "ru"
      ? "Демо режим предназначен для тестирования и демонстрации. Данные являются синтетическими."
      : "Demo mode is for testing and demonstration. Data is synthetic.",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{t.title}</h1>
          <p className="text-sm text-stone-500 mt-1">{t.subtitle}</p>
        </div>
        <PfActionsBar
          demoInitialized={demoState.demoInitialized}
          onInitDemo={handleInitDemo}
          onResetDemo={handleResetDemo}
          onExportData={handleExportData}
        />
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-amber-800">{t.disclaimer}</p>
      </div>

      {/* KPI Strip */}
      <PfKpiStrip
        kpis={{
          demoInitialized: demoState.demoInitialized,
          seedVersion: demoState.seedVersion,
          totalRecords: demoState.totalRecords,
          navHealth: demoState.navHealth,
          openTasks: demoState.openTasks,
          openAlerts: demoState.openAlerts,
          newNotifications: demoState.unreadNotifications,
          lastReset: demoState.lastResetAt,
        }}
        onKpiClick={handleKpiClick}
      />

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PfDemoModePanel
          demoInitialized={demoState.demoInitialized}
          seedProfile={demoState.seedProfile}
          onInitDemo={handleInitDemo}
          onResetDemo={handleResetDemo}
          onGenerateEvents={handleGenerateEvents}
        />

        <PfPersonaSwitcher
          currentRole={demoState.personaRole as UserRole}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Seed Manager */}
      <PfSeedManager
        currentProfile={demoState.seedProfile}
        onProfileChange={handleProfileChange}
      />
    </div>
  );
}

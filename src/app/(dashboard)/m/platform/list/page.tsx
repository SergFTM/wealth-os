"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Breadcrumbs } from "@/components/global";
import {
  PfSavedViewsTable,
  PfNavigationHealth,
  PfTourPanel,
  PfSettingsPanel,
  PfSearchPanel,
} from "@/modules/22-platform/ui";

type TabKey = "demo" | "search" | "savedViews" | "navigation" | "tour" | "settings";

interface SavedView {
  id: string;
  name: string;
  moduleKey: string;
  route: string;
  isPinned: boolean;
  createdAt: string;
}

function PlatformListContent() {
  const { locale } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("demo");
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const tabs: { key: TabKey; label: { ru: string; en: string } }[] = [
    { key: "demo", label: { ru: "Демо режим", en: "Demo Mode" } },
    { key: "search", label: { ru: "Поиск", en: "Search" } },
    { key: "savedViews", label: { ru: "Сохраненные виды", en: "Saved Views" } },
    { key: "navigation", label: { ru: "Навигация", en: "Navigation" } },
    { key: "tour", label: { ru: "Тур", en: "Tour" } },
    { key: "settings", label: { ru: "Настройки", en: "Settings" } },
  ];

  useEffect(() => {
    const tab = searchParams.get("tab") as TabKey | null;
    if (tab && tabs.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch saved views
    fetch("/api/collections/savedViews")
      .then((res) => res.json())
      .then((data) => setSavedViews(data.items || []))
      .catch(() => setSavedViews([]));
  }, []);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/platform/list?tab=${tab}`);
  };

  const handleTogglePin = async (id: string) => {
    const view = savedViews.find((v) => v.id === id);
    if (!view) return;

    await fetch(`/api/collections/savedViews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !view.isPinned }),
    });

    setSavedViews((views) =>
      views.map((v) => (v.id === id ? { ...v, isPinned: !v.isPinned } : v))
    );
  };

  const handleDeleteView = async (id: string) => {
    await fetch(`/api/collections/savedViews/${id}`, { method: "DELETE" });
    setSavedViews((views) => views.filter((v) => v.id !== id));
  };

  const t = {
    title: locale === "ru" ? "Платформа" : "Platform",
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <h1 className="text-2xl font-semibold text-stone-800">{t.title}</h1>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              {tab.label[locale === "ru" ? "ru" : "en"]}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "demo" && (
          <div className="text-center py-12 text-stone-500">
            <p>{locale === "ru" ? "Перейдите на главную страницу модуля для управления демо" : "Go to main module page to manage demo"}</p>
            <button
              onClick={() => router.push("/m/platform")}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              {locale === "ru" ? "Открыть Dashboard" : "Open Dashboard"}
            </button>
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">
              {locale === "ru"
                ? "Глобальный поиск по всем объектам системы. Используйте Ctrl+K или ⌘K."
                : "Global search across all system objects. Use Ctrl+K or ⌘K."}
            </p>
            <button
              onClick={() => setSearchOpen(true)}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              {locale === "ru" ? "Открыть поиск" : "Open Search"}
            </button>
            <PfSearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {activeTab === "savedViews" && (
          <PfSavedViewsTable
            views={savedViews}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteView}
          />
        )}

        {activeTab === "navigation" && <PfNavigationHealth />}

        {activeTab === "tour" && <PfTourPanel />}

        {activeTab === "settings" && <PfSettingsPanel />}
      </div>
    </div>
  );
}

export default function PlatformListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PlatformListContent />
    </Suspense>
  );
}

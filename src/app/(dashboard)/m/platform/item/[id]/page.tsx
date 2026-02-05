"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Breadcrumbs } from "@/components/global";

interface SavedView {
  id: string;
  name: string;
  moduleKey: string;
  route: string;
  filtersJson: string;
  columnsJson?: string;
  isPinned: boolean;
  createdAt: string;
}

interface DemoScenario {
  id: string;
  name: string;
  description: string;
  stepsJson: string;
  category: string;
  persona: string;
}

export default function PlatformItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { locale } = useApp();
  const router = useRouter();
  const [item, setItem] = useState<SavedView | DemoScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemType, setItemType] = useState<"savedView" | "demoScenario" | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      // Try savedViews first
      let res = await fetch(`/api/collections/savedViews/${id}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data);
        setItemType("savedView");
        setLoading(false);
        return;
      }

      // Try demoScenarios
      res = await fetch(`/api/collections/demoScenarios/${id}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data);
        setItemType("demoScenario");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const t = {
    notFound: locale === "ru" ? "Объект не найден" : "Item not found",
    back: locale === "ru" ? "Назад" : "Back",
    savedView: locale === "ru" ? "Сохраненный вид" : "Saved View",
    scenario: locale === "ru" ? "Демо сценарий" : "Demo Scenario",
    module: locale === "ru" ? "Модуль" : "Module",
    route: locale === "ru" ? "Маршрут" : "Route",
    filters: locale === "ru" ? "Фильтры" : "Filters",
    pinned: locale === "ru" ? "Закреплено" : "Pinned",
    category: locale === "ru" ? "Категория" : "Category",
    persona: locale === "ru" ? "Персона" : "Persona",
    steps: locale === "ru" ? "Шаги" : "Steps",
    apply: locale === "ru" ? "Применить" : "Apply",
    run: locale === "ru" ? "Запустить" : "Run",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500">{t.notFound}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-stone-100 text-stone-600 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  if (itemType === "savedView") {
    const view = item as SavedView;
    return (
      <div className="space-y-6">
        <Breadcrumbs />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wide">{t.savedView}</span>
            <h1 className="text-2xl font-semibold text-stone-800">{view.name}</h1>
          </div>
          <button
            onClick={() => router.push(view.route)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            {t.apply}
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-stone-500">{t.module}</dt>
              <dd className="font-medium text-stone-800">{view.moduleKey}</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500">{t.pinned}</dt>
              <dd className="font-medium text-stone-800">{view.isPinned ? "✓" : "—"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-stone-500">{t.route}</dt>
              <dd className="font-mono text-sm text-stone-600 bg-stone-50 p-2 rounded mt-1">
                {view.route}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-stone-500">{t.filters}</dt>
              <dd className="font-mono text-xs text-stone-600 bg-stone-50 p-2 rounded mt-1 max-h-40 overflow-auto">
                {view.filtersJson || "{}"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  if (itemType === "demoScenario") {
    const scenario = item as DemoScenario;
    let steps: { step: number; action: string }[] = [];
    try {
      steps = JSON.parse(scenario.stepsJson);
    } catch {
      steps = [];
    }

    return (
      <div className="space-y-6">
        <Breadcrumbs />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wide">{t.scenario}</span>
            <h1 className="text-2xl font-semibold text-stone-800">{scenario.name}</h1>
          </div>
          <button
            onClick={() => alert("Run scenario (MVP stub)")}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            {t.run}
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <p className="text-stone-600 mb-4">{scenario.description}</p>
          <dl className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <dt className="text-sm text-stone-500">{t.category}</dt>
              <dd className="font-medium text-stone-800 capitalize">{scenario.category}</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500">{t.persona}</dt>
              <dd className="font-medium text-stone-800 capitalize">{scenario.persona}</dd>
            </div>
          </dl>

          <div>
            <h3 className="text-sm font-medium text-stone-600 mb-3">{t.steps}</h3>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                    {step.step || i + 1}
                  </span>
                  <span className="text-stone-700">{step.action}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

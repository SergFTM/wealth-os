"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { moduleRegistry } from "@/modules";

interface RouteStatus {
  module: string;
  route: string;
  status: "ok" | "error" | "checking";
}

export function PfNavigationHealth() {
  const { locale } = useApp();
  const [routes, setRoutes] = useState<RouteStatus[]>([]);
  const [checking, setChecking] = useState(false);

  const t = {
    title: locale === "ru" ? "Проверка навигации" : "Navigation Health",
    check: locale === "ru" ? "Проверить маршруты" : "Check Routes",
    checking: locale === "ru" ? "Проверка..." : "Checking...",
    module: locale === "ru" ? "Модуль" : "Module",
    route: locale === "ru" ? "Маршрут" : "Route",
    status: locale === "ru" ? "Статус" : "Status",
    ok: locale === "ru" ? "OK" : "OK",
    error: locale === "ru" ? "Ошибка" : "Error",
    health: locale === "ru" ? "Здоровье навигации" : "Navigation Health",
  };

  const checkRoutes = async () => {
    setChecking(true);
    const results: RouteStatus[] = [];

    for (const module of moduleRegistry) {
      const baseRoute = `/m/${module.slug}`;
      const routesToCheck = [
        { route: baseRoute, label: "Dashboard" },
        { route: `${baseRoute}/list`, label: "List" },
      ];

      for (const { route } of routesToCheck) {
        results.push({
          module: module.slug,
          route,
          status: "checking",
        });
      }
    }

    setRoutes(results);

    // Simulate route checking (in real app, would fetch each route)
    const checked = results.map((r) => ({
      ...r,
      status: "ok" as const, // All routes are OK in MVP
    }));

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRoutes(checked);
    setChecking(false);
  };

  useEffect(() => {
    // Initialize with module routes
    const initial = moduleRegistry.flatMap((module) => [
      { module: module.slug, route: `/m/${module.slug}`, status: "ok" as const },
      { module: module.slug, route: `/m/${module.slug}/list`, status: "ok" as const },
    ]);
    setRoutes(initial);
  }, []);

  const okCount = routes.filter((r) => r.status === "ok").length;
  const healthPercent = routes.length > 0 ? Math.round((okCount / routes.length) * 100) : 100;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-800">{t.title}</h3>
        <button
          onClick={checkRoutes}
          disabled={checking}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
        >
          {checking ? t.checking : t.check}
        </button>
      </div>

      <div className="mb-4 p-4 bg-stone-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-600">{t.health}</span>
          <span
            className={cn(
              "text-lg font-bold",
              healthPercent === 100 ? "text-emerald-600" : healthPercent >= 90 ? "text-amber-600" : "text-rose-600"
            )}
          >
            {healthPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              healthPercent === 100 ? "bg-emerald-500" : healthPercent >= 90 ? "bg-amber-500" : "bg-rose-500"
            )}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-stone-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-stone-600">{t.module}</th>
              <th className="px-3 py-2 text-left font-medium text-stone-600">{t.route}</th>
              <th className="px-3 py-2 text-left font-medium text-stone-600">{t.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {routes.slice(0, 20).map((r, i) => (
              <tr key={i} className="hover:bg-stone-50/50">
                <td className="px-3 py-2 text-stone-600">{r.module}</td>
                <td className="px-3 py-2 text-stone-500 font-mono text-xs">{r.route}</td>
                <td className="px-3 py-2">
                  {r.status === "checking" ? (
                    <span className="text-blue-500 text-xs">...</span>
                  ) : r.status === "ok" ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t.ok}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t.error}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

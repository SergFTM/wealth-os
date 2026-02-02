"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";

export default function PerformancePage() {
  const { t } = useApp();

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.performance}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="YTD Return" value="+8.4%" trend={{ value: 8.4, positive: true }} status="ok" />
        <KpiCard title="1Y Return" value="+12.6%" trend={{ value: 12.6, positive: true }} status="ok" />
        <KpiCard title="vs Benchmark" value="+2.1%" status="ok" />
        <KpiCard title="Sharpe Ratio" value="1.42" status="ok" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8">
        <div className="h-64 flex items-center justify-center text-stone-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>График эффективности портфеля</p>
            <p className="text-sm mt-1">Performance vs Benchmark</p>
          </div>
        </div>
      </div>
    </div>
  );
}

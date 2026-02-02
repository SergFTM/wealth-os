"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";

export default function TaxPage() {
  const { t } = useApp();

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.tax}</h1>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t.disclaimers.tax}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Налоговая экономия (YTD)" value="$1.2M" status="ok" />
        <KpiCard title="Tax-Loss Harvesting" value="$450K" status="ok" />
        <KpiCard title="Unrealized Gains" value="$8.5M" status="info" />
        <KpiCard title="Estimated Tax" value="$2.1M" status="warning" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Налоговый анализ</h2>
        <div className="h-64 flex items-center justify-center text-stone-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p>Налоговый калькулятор</p>
          </div>
        </div>
      </div>
    </div>
  );
}

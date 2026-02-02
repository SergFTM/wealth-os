"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";

export default function AiPage() {
  const { t } = useApp();

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.ai}</h1>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t.disclaimers.ai}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Запросов (месяц)" value="234" status="ok" />
        <KpiCard title="Точность" value="94%" status="ok" />
        <KpiCard title="Время ответа" value="2.3s" status="ok" />
        <KpiCard title="Feedback Score" value="4.8/5" status="ok" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">AI Copilot Analytics</h2>
        <div className="h-64 flex items-center justify-center text-stone-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <p>AI Usage Analytics Dashboard</p>
            <p className="text-sm mt-1">Query types, response times, feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}

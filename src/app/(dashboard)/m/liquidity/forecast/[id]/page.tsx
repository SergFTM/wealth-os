"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { LqForecastDetail } from "@/modules/39-liquidity/ui/LqForecastDetail";
import type { CashForecast } from "@/modules/39-liquidity/engine/types";

export default function ForecastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: forecast, isLoading } = useRecord("cashForecasts", id) as { data: CashForecast | null; isLoading: boolean };
  const { data: allFlows = [] } = useCollection("cashFlows");
  const { data: allScenarios = [] } = useCollection("cashScenarios");
  const { data: allStressTests = [] } = useCollection("cashStressTests");
  const { data: allAlerts = [] } = useCollection("liquidityAlerts");

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-1/3"></div>
          <div className="h-4 bg-stone-200 rounded w-1/4"></div>
          <div className="h-64 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Прогноз не найден</h2>
          <p className="text-stone-500 mb-4">Прогноз с ID &quot;{id}&quot; не существует</p>
          <button
            onClick={() => router.push("/m/liquidity")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Вернуться к дашборду
          </button>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flows = (allFlows as any[]).filter((f) => f.forecastId === id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scenarios = (allScenarios as any[]).filter((s) => s.forecastId === id || !s.forecastId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stressTests = (allStressTests as any[]).filter((t) => t.forecastId === id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alerts = (allAlerts as any[]).filter((a) => a.forecastId === id);

  return (
    <div className="p-6">
      <LqForecastDetail
        forecast={forecast}
        flows={flows}
        scenarios={scenarios}
        stressTests={stressTests}
        alerts={alerts}
        onBack={() => router.push("/m/liquidity")}
        onCompute={() => console.log("Compute forecast:", id)}
        onAddScenario={() => router.push("/m/liquidity/scenario/new?forecastId=" + id)}
        onRunStressTest={() => router.push("/m/liquidity/stress/new?forecastId=" + id)}
        onShowAudit={() => console.log("Show audit for forecast:", id)}
        onOpenScenario={(scenarioId) => router.push("/m/liquidity/scenario/" + scenarioId)}
        onOpenStressTest={(testId) => router.push("/m/liquidity/stress/" + testId)}
        onOpenAlert={(alertId) => router.push("/m/liquidity/alert/" + alertId)}
      />
    </div>
  );
}

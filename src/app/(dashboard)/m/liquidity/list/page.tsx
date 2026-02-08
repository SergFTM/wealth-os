"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCollection } from "@/lib/hooks";
import { LqForecastsTable } from "@/modules/39-liquidity/ui/LqForecastsTable";
import { LqCashPositionsTable } from "@/modules/39-liquidity/ui/LqCashPositionsTable";
import { LqFlowsTable } from "@/modules/39-liquidity/ui/LqFlowsTable";
import { LqScenariosTable } from "@/modules/39-liquidity/ui/LqScenariosTable";
import { LqStressTestsTable } from "@/modules/39-liquidity/ui/LqStressTestsTable";
import { LqAlertsTable } from "@/modules/39-liquidity/ui/LqAlertsTable";
import { ArrowLeft, Plus } from "lucide-react";

type TabKey = "forecasts" | "positions" | "inflows" | "outflows" | "scenarios" | "stress" | "alerts" | "audit";

export default function LiquidityListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabKey | null;
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam || "forecasts");

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const { data: forecasts = [] } = useCollection("cashForecasts");
  const { data: positions = [] } = useCollection("cashPositions");
  const { data: flows = [] } = useCollection("cashFlows");
  const { data: scenarios = [] } = useCollection("cashScenarios");
  const { data: stressTests = [] } = useCollection("cashStressTests");
  const { data: alerts = [] } = useCollection("liquidityAlerts");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inflows = (flows as any[]).filter((f) => f.flowType === "inflow");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outflows = (flows as any[]).filter((f) => f.flowType === "outflow");

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push("/m/liquidity/list?tab=" + tab);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/m/liquidity")} className="p-2 hover:bg-stone-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Планирование ликвидности</h1>
            <p className="text-sm text-stone-500 mt-1">Полный список данных</p>
          </div>
        </div>
        {activeTab === "forecasts" && (
          <button onClick={() => router.push("/m/liquidity/forecast/new")} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg">
            <Plus className="w-4 h-4" /><span className="text-sm font-medium">Новый прогноз</span>
          </button>
        )}
      </div>

      <div className="border-b border-stone-200 mb-6">
        <div className="flex gap-6 overflow-x-auto">
          {[
            { key: "forecasts", label: "Прогнозы" },
            { key: "positions", label: "Позиции" },
            { key: "inflows", label: "Притоки" },
            { key: "outflows", label: "Оттоки" },
            { key: "scenarios", label: "Сценарии" },
            { key: "stress", label: "Стресс-тесты" },
            { key: "alerts", label: "Алерты" },
            { key: "audit", label: "Аудит" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => handleTabChange(tab.key as TabKey)}
              className={"px-1 py-3 text-sm font-medium border-b-2 " + (activeTab === tab.key ? "border-emerald-500 text-emerald-600" : "border-transparent text-stone-500")}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        {activeTab === "forecasts" && <LqForecastsTable forecasts={forecasts as any} onOpen={(id) => router.push("/m/liquidity/forecast/" + id)} />}
        {activeTab === "positions" && <LqCashPositionsTable positions={positions as any} onOpen={(id) => router.push("/m/liquidity/position/" + id)} />}
        {activeTab === "inflows" && <LqFlowsTable flows={inflows as any} flowType="inflow" />}
        {activeTab === "outflows" && <LqFlowsTable flows={outflows as any} flowType="outflow" />}
        {activeTab === "scenarios" && <LqScenariosTable scenarios={scenarios as any} onOpen={(id) => router.push("/m/liquidity/scenario/" + id)} />}
        {activeTab === "stress" && <LqStressTestsTable tests={stressTests as any} onOpen={(id) => router.push("/m/liquidity/stress/" + id)} />}
        {activeTab === "alerts" && <LqAlertsTable alerts={alerts as any} onOpen={(id) => router.push("/m/liquidity/alert/" + id)} />}
        {activeTab === "audit" && <div className="p-6 text-center text-stone-400">Audit trail будет отображён здесь</div>}
      </div>
      {/* eslint-enable @typescript-eslint/no-explicit-any */}
    </div>
  );
}

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord } from "@/lib/hooks";
import { LqAlertDetail } from "@/modules/39-liquidity/ui/LqAlertDetail";

export default function AlertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: alert, isLoading } = useRecord("liquidityAlerts", id);

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

  if (!alert) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Алерт не найден</h2>
          <p className="text-stone-500 mb-4">Алерт с ID &quot;{id}&quot; не существует</p>
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

  return (
    <div className="p-6">
      <LqAlertDetail
        alert={alert}
        onBack={() => router.back()}
        onAcknowledge={() => console.log("Acknowledge alert:", id)}
        onClose={() => {
          console.log("Close alert:", id);
          router.push("/m/liquidity/list?tab=alerts");
        }}
        onCreateTask={() => console.log("Create task from alert:", id)}
      />
    </div>
  );
}

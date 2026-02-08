"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { CrCovenantDetail } from "@/modules/50-credit/ui";
import type { CreditFacility, CreditLoan, CreditCovenant } from "@/modules/50-credit/engine/types";

export default function CovenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const { data: covenant, isLoading } = useRecord("creditCovenants", id) as { data: CreditCovenant | null; isLoading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allLoans = [] } = useCollection("creditLoans") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allFacilities = [] } = useCollection("creditFacilities") as { data: any[] };

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

  if (!covenant) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Ковенант не найден</h2>
          <p className="text-stone-500 mb-4">Ковенант с ID &quot;{id}&quot; не существует</p>
          <button
            onClick={() => router.push("/m/credit")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Вернуться к дашборду
          </button>
        </div>
      </div>
    );
  }

  const loan = covenant.linkedType === 'loan'
    ? (allLoans as CreditLoan[]).find((l) => l.id === covenant.linkedId)
    : undefined;
  const facility = covenant.linkedType === 'facility'
    ? (allFacilities as CreditFacility[]).find((f) => f.id === covenant.linkedId)
    : loan
      ? (allFacilities as CreditFacility[]).find((f) => f.id === loan.facilityId)
      : undefined;

  // If action=test, trigger test on mount
  if (action === 'test') {
    console.log('Auto-trigger covenant test for:', id);
  }

  return (
    <div className="p-6">
      <CrCovenantDetail
        covenant={covenant}
        loan={loan}
        facility={facility}
        onBack={() => router.push("/m/credit")}
        onEdit={() => console.log("Edit covenant:", id)}
        onOpenLoan={(loanId) => router.push(`/m/credit/loan/${loanId}`)}
        onOpenFacility={(facilityId) => router.push(`/m/credit/facility/${facilityId}`)}
        onTest={() => console.log("Test covenant:", id)}
        onRequestWaiver={() => console.log("Request waiver for covenant:", id)}
        onShowAudit={() => console.log("Show audit for covenant:", id)}
      />
    </div>
  );
}

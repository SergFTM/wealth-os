"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { CrCollateralDetail } from "@/modules/50-credit/ui";
import type { CreditFacility, CreditLoan, CreditCollateral } from "@/modules/50-credit/engine/types";

export default function CollateralDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: collateral, isLoading } = useRecord("creditCollateral", id) as { data: CreditCollateral | null; isLoading: boolean };
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

  if (!collateral) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Залог не найден</h2>
          <p className="text-stone-500 mb-4">Залог с ID &quot;{id}&quot; не существует</p>
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

  const loan = collateral.linkedType === 'loan'
    ? (allLoans as CreditLoan[]).find((l) => l.id === collateral.linkedId)
    : undefined;
  const facility = collateral.linkedType === 'facility'
    ? (allFacilities as CreditFacility[]).find((f) => f.id === collateral.linkedId)
    : loan
      ? (allFacilities as CreditFacility[]).find((f) => f.id === loan.facilityId)
      : undefined;

  return (
    <div className="p-6">
      <CrCollateralDetail
        collateral={collateral}
        loan={loan}
        facility={facility}
        onBack={() => router.push("/m/credit")}
        onEdit={() => console.log("Edit collateral:", id)}
        onOpenLoan={(loanId) => router.push(`/m/credit/loan/${loanId}`)}
        onOpenFacility={(facilityId) => router.push(`/m/credit/facility/${facilityId}`)}
        onRevalue={() => console.log("Revalue collateral:", id)}
        onShowAudit={() => console.log("Show audit for collateral:", id)}
      />
    </div>
  );
}

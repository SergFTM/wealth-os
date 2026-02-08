"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { CrFacilityDetail } from "@/modules/50-credit/ui";
import type { CreditBank, CreditFacility, CreditLoan, CreditCovenant } from "@/modules/50-credit/engine/types";

export default function FacilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: facility, isLoading } = useRecord("creditFacilities", id) as { data: CreditFacility | null; isLoading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allBanks = [] } = useCollection("creditBanks") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allLoans = [] } = useCollection("creditLoans") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allCovenants = [] } = useCollection("creditCovenants") as { data: any[] };

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

  if (!facility) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Facility не найден</h2>
          <p className="text-stone-500 mb-4">Facility с ID &quot;{id}&quot; не существует</p>
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

  const bank = (allBanks as CreditBank[]).find((b) => b.id === facility.bankId);
  const loans = (allLoans as CreditLoan[]).filter((l) => l.facilityId === id);
  const covenants = (allCovenants as CreditCovenant[]).filter((c) => c.linkedType === 'facility' && c.linkedId === id);

  return (
    <div className="p-6">
      <CrFacilityDetail
        facility={facility}
        bank={bank}
        loans={loans}
        covenants={covenants}
        onBack={() => router.push("/m/credit")}
        onEdit={() => console.log("Edit facility:", id)}
        onOpenBank={(bankId) => router.push(`/m/credit/bank/${bankId}`)}
        onOpenLoan={(loanId) => router.push(`/m/credit/loan/${loanId}`)}
        onOpenCovenant={(covenantId) => router.push(`/m/credit/covenant/${covenantId}`)}
        onDrawdown={() => router.push(`/m/credit/loan/new?facilityId=${id}`)}
        onShowAudit={() => console.log("Show audit for facility:", id)}
      />
    </div>
  );
}

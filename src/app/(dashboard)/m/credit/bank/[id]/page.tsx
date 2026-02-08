"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { CrBankDetail } from "@/modules/50-credit/ui";
import type { CreditBank, CreditFacility, CreditLoan } from "@/modules/50-credit/engine/types";

export default function BankDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: bank, isLoading } = useRecord("creditBanks", id) as { data: CreditBank | null; isLoading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allFacilities = [] } = useCollection("creditFacilities") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allLoans = [] } = useCollection("creditLoans") as { data: any[] };

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

  if (!bank) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Банк не найден</h2>
          <p className="text-stone-500 mb-4">Банк с ID &quot;{id}&quot; не существует</p>
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

  const facilities = (allFacilities as CreditFacility[]).filter((f) => f.bankId === id);
  const loans = (allLoans as CreditLoan[]).filter((l) => {
    const facility = facilities.find(f => f.id === l.facilityId);
    return !!facility;
  });

  const totalExposure = loans
    .filter(l => l.statusKey === 'active')
    .reduce((sum, l) => sum + l.outstandingAmount, 0);

  return (
    <div className="p-6">
      <CrBankDetail
        bank={bank}
        facilities={facilities}
        loans={loans}
        totalExposure={totalExposure}
        onBack={() => router.push("/m/credit")}
        onEdit={() => console.log("Edit bank:", id)}
        onOpenFacility={(facilityId) => router.push(`/m/credit/facility/${facilityId}`)}
        onOpenLoan={(loanId) => router.push(`/m/credit/loan/${loanId}`)}
        onShowAudit={() => console.log("Show audit for bank:", id)}
      />
    </div>
  );
}

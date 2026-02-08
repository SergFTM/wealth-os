"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { CrLoanDetail } from "@/modules/50-credit/ui";
import type { CreditFacility, CreditLoan, CreditCollateral, CreditCovenant, CreditPayment, CreditSchedule } from "@/modules/50-credit/engine/types";

export default function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: loan, isLoading } = useRecord("creditLoans", id) as { data: CreditLoan | null; isLoading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allFacilities = [] } = useCollection("creditFacilities") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allCollaterals = [] } = useCollection("creditCollateral") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allCovenants = [] } = useCollection("creditCovenants") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allPayments = [] } = useCollection("creditPayments") as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allSchedules = [] } = useCollection("creditSchedules") as { data: any[] };

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

  if (!loan) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Займ не найден</h2>
          <p className="text-stone-500 mb-4">Займ с ID &quot;{id}&quot; не существует</p>
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

  const facility = (allFacilities as CreditFacility[]).find((f) => f.id === loan.facilityId);
  const collaterals = (allCollaterals as CreditCollateral[]).filter((c) => c.linkedType === 'loan' && c.linkedId === id);
  const covenants = (allCovenants as CreditCovenant[]).filter((c) => c.linkedType === 'loan' && c.linkedId === id);
  const payments = (allPayments as CreditPayment[]).filter((p) => p.loanId === id);
  const schedule = (allSchedules as CreditSchedule[]).find((s) => s.loanId === id);

  return (
    <div className="p-6">
      <CrLoanDetail
        loan={loan}
        facility={facility}
        collaterals={collaterals}
        covenants={covenants}
        payments={payments}
        schedule={schedule}
        onBack={() => router.push("/m/credit")}
        onEdit={() => console.log("Edit loan:", id)}
        onOpenFacility={(facilityId) => router.push(`/m/credit/facility/${facilityId}`)}
        onOpenCollateral={(collateralId) => router.push(`/m/credit/collateral/${collateralId}`)}
        onOpenCovenant={(covenantId) => router.push(`/m/credit/covenant/${covenantId}`)}
        onOpenPayment={(paymentId) => router.push(`/m/credit/payment/${paymentId}`)}
        onRecordPayment={(paymentId) => router.push(`/m/credit/payment/${paymentId}?action=record`)}
        onAddCollateral={() => router.push(`/m/credit/collateral/new?loanId=${id}`)}
        onGenerateSchedule={() => console.log("Generate schedule for loan:", id)}
        onShowAudit={() => console.log("Show audit for loan:", id)}
      />
    </div>
  );
}

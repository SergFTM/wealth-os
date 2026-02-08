"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { CrPaymentDetail } from "@/modules/50-credit/ui";
import type { CreditLoan, CreditPayment } from "@/modules/50-credit/engine/types";

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const { data: payment, isLoading } = useRecord("creditPayments", id) as { data: CreditPayment | null; isLoading: boolean };
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

  if (!payment) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Платеж не найден</h2>
          <p className="text-stone-500 mb-4">Платеж с ID &quot;{id}&quot; не существует</p>
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

  const loan = (allLoans as CreditLoan[]).find((l) => l.id === payment.loanId);

  // If action=record, open record payment modal
  if (action === 'record') {
    console.log('Auto-trigger record payment for:', id);
  }

  return (
    <div className="p-6">
      <CrPaymentDetail
        payment={payment}
        loan={loan}
        onBack={() => router.push("/m/credit")}
        onEdit={() => console.log("Edit payment:", id)}
        onOpenLoan={(loanId) => router.push(`/m/credit/loan/${loanId}`)}
        onRecordPayment={() => console.log("Record payment:", id)}
        onShowAudit={() => console.log("Show audit for payment:", id)}
      />
    </div>
  );
}

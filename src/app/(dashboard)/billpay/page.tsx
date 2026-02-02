"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { invoices, formatCurrency, formatDate, Invoice } from "@/lib/data";

export default function BillpayPage() {
  const { t } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.billpay}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Всего счетов" value={invoices.length} status="ok" />
        <KpiCard title="К оплате" value={formatCurrency(totalPending)} status="warning" />
        <KpiCard title="Просрочено" value={formatCurrency(totalOverdue)} status="critical" />
        <KpiCard title="Оплачено (месяц)" value={formatCurrency(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0))} status="ok" />
      </div>

      <DataTable
        data={invoices}
        columns={[
          { key: 'number', header: '№', render: (item) => <span className="font-medium">{item.number}</span> },
          { key: 'client', header: 'Клиент' },
          { key: 'amount', header: 'Сумма', render: (item) => formatCurrency(item.amount) },
          { key: 'status', header: 'Статус', render: (item) => <StatusBadge status={item.status} size="sm" /> },
          { key: 'dueDate', header: 'Срок', render: (item) => formatDate(item.dueDate) },
        ]}
        onRowClick={(item) => setSelectedInvoice(item)}
      />

      <Drawer open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title="Детали счета">
        {selectedInvoice && (
          <div className="space-y-4">
            <div><label className="text-xs text-stone-500">Номер</label><p className="font-medium">{selectedInvoice.number}</p></div>
            <div><label className="text-xs text-stone-500">Клиент</label><p>{selectedInvoice.client}</p></div>
            <div><label className="text-xs text-stone-500">Сумма</label><p className="text-xl font-bold">{formatCurrency(selectedInvoice.amount)}</p></div>
            <div><label className="text-xs text-stone-500">Статус</label><div className="mt-1"><StatusBadge status={selectedInvoice.status} /></div></div>
            <div><label className="text-xs text-stone-500">Срок оплаты</label><p>{formatDate(selectedInvoice.dueDate)}</p></div>
            <div><label className="text-xs text-stone-500">Выставлен</label><p>{formatDate(selectedInvoice.issuedDate)}</p></div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

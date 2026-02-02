"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";

interface GLEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

const glEntries: GLEntry[] = [
  { id: '1', date: '2026-01-28', account: 'Cash', description: 'Dividend received - AAPL', debit: 15000, credit: 0, balance: 2515000 },
  { id: '2', date: '2026-01-27', account: 'Investments', description: 'Purchase - MSFT shares', debit: 0, credit: 50000, balance: 8950000 },
  { id: '3', date: '2026-01-26', account: 'Cash', description: 'Wire transfer in', debit: 100000, credit: 0, balance: 2550000 },
  { id: '4', date: '2026-01-25', account: 'Fees', description: 'Management fee Q4', debit: 0, credit: 25000, balance: 125000 },
  { id: '5', date: '2026-01-24', account: 'Investments', description: 'Sale - GOOG shares', debit: 75000, credit: 0, balance: 9000000 },
];

export default function GLPage() {
  const { t } = useApp();
  const [selectedEntry, setSelectedEntry] = useState<GLEntry | null>(null);

  const formatCurrency = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.gl}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Всего транзакций" value="1,234" status="ok" />
        <KpiCard title="Дебет (месяц)" value={formatCurrency(450000)} status="ok" />
        <KpiCard title="Кредит (месяц)" value={formatCurrency(380000)} status="ok" />
        <KpiCard title="Баланс" value={formatCurrency(2515000)} status="ok" />
      </div>

      <DataTable
        data={glEntries}
        columns={[
          { key: 'date', header: 'Дата', width: '100px' },
          { key: 'account', header: 'Счет' },
          { key: 'description', header: 'Описание' },
          { key: 'debit', header: 'Дебет', render: (item) => item.debit > 0 ? formatCurrency(item.debit) : '-' },
          { key: 'credit', header: 'Кредит', render: (item) => item.credit > 0 ? formatCurrency(item.credit) : '-' },
          { key: 'balance', header: 'Баланс', render: (item) => formatCurrency(item.balance) },
        ]}
        onRowClick={(item) => setSelectedEntry(item)}
      />

      <Drawer open={!!selectedEntry} onClose={() => setSelectedEntry(null)} title="Детали записи">
        {selectedEntry && (
          <div className="space-y-4">
            <div><label className="text-xs text-stone-500">Дата</label><p>{selectedEntry.date}</p></div>
            <div><label className="text-xs text-stone-500">Счет</label><p>{selectedEntry.account}</p></div>
            <div><label className="text-xs text-stone-500">Описание</label><p>{selectedEntry.description}</p></div>
            <div className="flex gap-4">
              <div><label className="text-xs text-stone-500">Дебет</label><p>{formatCurrency(selectedEntry.debit)}</p></div>
              <div><label className="text-xs text-stone-500">Кредит</label><p>{formatCurrency(selectedEntry.credit)}</p></div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  accounts,
  clients,
  formatCurrency,
  getTotalNetWorth,
  Account,
} from "@/lib/data";

interface AssetRow {
  id: string;
  name: string;
  type: string;
  value: number;
  allocation: number;
  change: number;
}

export default function NetWorthPage() {
  const { t } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<AssetRow | null>(null);
  const [showAudit, setShowAudit] = useState(false);

  const totalNetWorth = getTotalNetWorth();
  
  // Create asset rows from accounts
  const assetRows: AssetRow[] = accounts.map(acc => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    value: acc.balance,
    allocation: (acc.balance / totalNetWorth) * 100,
    change: Math.random() * 10 - 3, // Mock change
  }));

  const totalAssets = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = 12500000; // Mock
  const netWorth = totalAssets - totalLiabilities;

  const auditTrail = [
    { date: '2026-01-28 10:30', action: 'Синхронизация', user: 'System', details: 'Обновлены данные из Charles Schwab' },
    { date: '2026-01-27 16:00', action: 'Ребалансировка', user: 'Алексей П.', details: 'Перераспределение 5% в облигации' },
    { date: '2026-01-26 09:15', action: 'Новый актив', user: 'Мария К.', details: 'Добавлен счет в UBS' },
    { date: '2026-01-25 14:00', action: 'Обновление цен', user: 'System', details: 'Переоценка портфеля' },
  ];

  return (
    <div>
      <ScopeBar />
      
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.netWorth}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Общие активы"
          value={formatCurrency(totalAssets)}
          trend={{ value: 3.2, positive: true }}
          status="ok"
        />
        <KpiCard
          title="Обязательства"
          value={formatCurrency(totalLiabilities)}
          status="warning"
        />
        <KpiCard
          title="Чистая стоимость"
          value={formatCurrency(netWorth)}
          trend={{ value: 2.8, positive: true }}
          status="ok"
        />
        <KpiCard
          title="Количество счетов"
          value={accounts.length}
          status="ok"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Структура активов</h2>
        <Button variant="secondary" size="sm" onClick={() => setShowAudit(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View audit trail
        </Button>
      </div>

      {/* Assets Table */}
      <DataTable
        data={assetRows}
        columns={[
          { key: 'name', header: 'Актив', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'type', header: 'Тип', render: (item) => <span className="capitalize text-stone-600">{item.type}</span> },
          { key: 'value', header: 'Стоимость', render: (item) => formatCurrency(item.value) },
          { key: 'allocation', header: 'Доля', width: '80px', render: (item) => `${item.allocation.toFixed(1)}%` },
          { key: 'change', header: 'Изменение', width: '100px', render: (item) => (
            <span className={item.change >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          )},
        ]}
        onRowClick={(item) => setSelectedAsset(item)}
      />

      {/* Asset Detail Drawer */}
      <Drawer open={!!selectedAsset} onClose={() => setSelectedAsset(null)} title="Детали актива">
        {selectedAsset && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-stone-500">Название</label>
              <p className="font-medium text-stone-800">{selectedAsset.name}</p>
            </div>
            <div>
              <label className="text-xs text-stone-500">Тип</label>
              <p className="text-stone-700 capitalize">{selectedAsset.type}</p>
            </div>
            <div>
              <label className="text-xs text-stone-500">Стоимость</label>
              <p className="text-2xl font-bold text-stone-800">{formatCurrency(selectedAsset.value)}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-stone-500">Доля портфеля</label>
                <p className="text-stone-700">{selectedAsset.allocation.toFixed(2)}%</p>
              </div>
              <div>
                <label className="text-xs text-stone-500">Изменение</label>
                <p className={selectedAsset.change >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                  {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)}%
                </p>
              </div>
            </div>
            <hr className="my-4" />
            <Button variant="secondary" size="sm" onClick={() => { setSelectedAsset(null); setShowAudit(true); }}>
              View audit trail →
            </Button>
          </div>
        )}
      </Drawer>

      {/* Audit Trail Drawer */}
      <Drawer open={showAudit} onClose={() => setShowAudit(false)} title="Audit Trail">
        <div className="space-y-4">
          {auditTrail.map((entry, i) => (
            <div key={i} className="border-l-2 border-emerald-200 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-stone-400">{entry.date}</span>
                <StatusBadge status="info" label={entry.action} size="sm" />
              </div>
              <p className="text-sm text-stone-700">{entry.details}</p>
              <p className="text-xs text-stone-500">by {entry.user}</p>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

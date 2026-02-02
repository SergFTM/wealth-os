"use client";

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useCollection } from '@/lib/hooks';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import seedData from '@/modules/02-net-worth/seed.json';

interface Holding {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  ticker?: string;
  assetClass: string;
  entityId?: string;
  accountId?: string;
  value: number;
  quantity?: number;
  price?: number;
  currency: string;
  valuationStatus: string;
  asOf: string;
  sourceType?: string;
  reconStatus?: string;
  liquidity: string;
  [key: string]: unknown;
}

interface Liability {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  type: string;
  entityId?: string;
  balance: number;
  rate?: number;
  currency: string;
  frequency?: string;
  nextPaymentDate?: string;
  status: string;
  [key: string]: unknown;
}

const tabs = [
  { key: 'holdings', label: { ru: 'Активы', en: 'Holdings' } },
  { key: 'liabilities', label: { ru: 'Обязательства', en: 'Liabilities' } },
  { key: 'valuations', label: { ru: 'Оценки', en: 'Valuations' } },
  { key: 'recon', label: { ru: 'Расхождения', en: 'Discrepancies' } }
];

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF ', RUB: '₽' };
  const symbol = symbols[currency] || currency + ' ';
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

export default function NetWorthListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, user } = useApp();
  const clientSafe = user?.role === 'client';

  const initialTab = searchParams.get('tab') || 'holdings';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    assetClass: searchParams.get('assetClass') || '',
    valuationStatus: searchParams.get('valuationStatus') || '',
    reconStatus: searchParams.get('recon') || '',
    liquidity: searchParams.get('liquidity') || '',
    search: searchParams.get('search') || ''
  });

  const { items: holdingsApi } = useCollection<Holding>('holdings', { limit: 100 });
  const { items: liabilitiesApi } = useCollection<Liability>('liabilities', { limit: 100 });

  const holdings: Holding[] = holdingsApi.length > 0 ? holdingsApi : (seedData.holdings as unknown as Holding[]);
  const liabilities: Liability[] = liabilitiesApi.length > 0 ? liabilitiesApi : (seedData.liabilities as unknown as Liability[]);

  const filteredHoldings = useMemo(() => {
    return holdings.filter(h => {
      if (filters.assetClass && h.assetClass !== filters.assetClass) return false;
      if (filters.valuationStatus && h.valuationStatus !== filters.valuationStatus) return false;
      if (filters.reconStatus && h.reconStatus !== filters.reconStatus) return false;
      if (filters.liquidity && h.liquidity !== filters.liquidity) return false;
      if (filters.search && !h.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [holdings, filters]);

  const reconIssues = holdings.filter(h => h.reconStatus === 'issue');

  const toggleRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    alert(`Bulk action: ${action} on ${selectedRows.length} items`);
    setSelectedRows([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            {locale === 'ru' ? 'Единый капитал — Список' : 'Net Worth — List'}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/m/net-worth')}>
          ← {locale === 'ru' ? 'Назад' : 'Back'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        {tabs.filter(t => clientSafe ? t.key !== 'recon' : true).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.key
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label[locale as 'ru' | 'en']}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder={locale === 'ru' ? 'Поиск...' : 'Search...'}
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm w-48"
          />
          <select
            value={filters.assetClass}
            onChange={e => setFilters(f => ({ ...f, assetClass: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
          >
            <option value="">{locale === 'ru' ? 'Все классы' : 'All Classes'}</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="RealEstate">Real Estate</option>
            <option value="Cash">Cash</option>
            <option value="Personal">Personal</option>
          </select>
          <select
            value={filters.liquidity}
            onChange={e => setFilters(f => ({ ...f, liquidity: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
          >
            <option value="">{locale === 'ru' ? 'Ликвидность' : 'Liquidity'}</option>
            <option value="liquid">{locale === 'ru' ? 'Ликвид' : 'Liquid'}</option>
            <option value="illiquid">{locale === 'ru' ? 'Неликвид' : 'Illiquid'}</option>
          </select>
          <select
            value={filters.valuationStatus}
            onChange={e => setFilters(f => ({ ...f, valuationStatus: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
          >
            <option value="">{locale === 'ru' ? 'Статус оценки' : 'Valuation Status'}</option>
            <option value="priced">Priced</option>
            <option value="estimated">Estimated</option>
            <option value="stale">Stale</option>
            <option value="missing">Missing</option>
          </select>
          {!clientSafe && (
            <select
              value={filters.reconStatus}
              onChange={e => setFilters(f => ({ ...f, reconStatus: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
            >
              <option value="">{locale === 'ru' ? 'Сверка' : 'Recon'}</option>
              <option value="ok">OK</option>
              <option value="issue">Issue</option>
              <option value="pending">Pending</option>
            </select>
          )}
          <Button variant="ghost" size="sm" onClick={() => setFilters({ assetClass: '', valuationStatus: '', reconStatus: '', liquidity: '', search: '' })}>
            {locale === 'ru' ? 'Сбросить' : 'Clear'}
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && !clientSafe && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-emerald-800">
            {locale === 'ru' ? `Выбрано: ${selectedRows.length}` : `Selected: ${selectedRows.length}`}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleBulkAction('setValuation')}>
              {locale === 'ru' ? 'Назначить статус' : 'Set Status'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleBulkAction('createTask')}>
              {locale === 'ru' ? 'Создать задачу' : 'Create Task'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
              {locale === 'ru' ? 'Отменить' : 'Cancel'}
            </Button>
          </div>
        </div>
      )}

      {/* Holdings Table */}
      {activeTab === 'holdings' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  {!clientSafe && (
                    <th className="py-2 px-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredHoldings.length && filteredHoldings.length > 0}
                        onChange={e => setSelectedRows(e.target.checked ? filteredHoldings.map(h => h.id) : [])}
                        className="rounded"
                      />
                    </th>
                  )}
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Актив' : 'Asset'}</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Тикер' : 'Ticker'}</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Класс' : 'Class'}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Кол-во' : 'Qty'}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Цена' : 'Price'}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Стоимость' : 'Value'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'На дату' : 'As-of'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Оценка' : 'Valuation'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Источник' : 'Source'}</th>
                  {!clientSafe && <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Сверка' : 'Recon'}</th>}
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Действия' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.map(holding => (
                  <tr
                    key={holding.id}
                    className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/m/net-worth/item/${holding.id}`)}
                  >
                    {!clientSafe && (
                      <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(holding.id)}
                          onChange={() => toggleRow(holding.id)}
                          className="rounded"
                        />
                      </td>
                    )}
                    <td className="py-3 px-3 font-medium text-stone-800">{holding.name}</td>
                    <td className="py-3 px-3 text-stone-500">{holding.ticker || '-'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-600">
                        {holding.assetClass}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-stone-600">{holding.quantity?.toLocaleString() || '-'}</td>
                    <td className="py-3 px-3 text-right text-stone-600">{holding.price ? formatCurrency(holding.price, holding.currency) : '-'}</td>
                    <td className="py-3 px-3 text-right font-medium text-stone-800">{formatCurrency(holding.value, holding.currency)}</td>
                    <td className="py-3 px-3 text-center text-xs text-stone-500">{new Date(holding.asOf).toLocaleDateString('ru-RU')}</td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge
                        status={holding.valuationStatus === 'priced' ? 'ok' : holding.valuationStatus === 'stale' ? 'warning' : 'pending'}
                        size="sm"
                        label={holding.valuationStatus}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                        {holding.sourceType || '-'}
                      </span>
                    </td>
                    {!clientSafe && (
                      <td className="py-3 px-3 text-center">
                        {holding.reconStatus && (
                          <StatusBadge
                            status={holding.reconStatus === 'ok' ? 'ok' : holding.reconStatus === 'issue' ? 'critical' : 'pending'}
                            size="sm"
                            label={holding.reconStatus}
                          />
                        )}
                      </td>
                    )}
                    <td className="py-3 px-3 text-right" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/m/net-worth/item/${holding.id}`)}>
                        {locale === 'ru' ? 'Открыть' : 'Open'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredHoldings.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              {locale === 'ru' ? 'Нет данных' : 'No data'}
            </div>
          )}
        </div>
      )}

      {/* Liabilities Table */}
      {activeTab === 'liabilities' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Обязательство' : 'Liability'}</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Тип' : 'Type'}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Баланс' : 'Balance'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Ставка' : 'Rate'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Частота' : 'Frequency'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'След. платёж' : 'Next Payment'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Статус' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {liabilities.map(liability => (
                  <tr
                    key={liability.id}
                    className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-stone-800">{liability.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-700">
                        {liability.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-rose-600">{formatCurrency(liability.balance, liability.currency)}</td>
                    <td className="py-3 px-3 text-center text-stone-600">{liability.rate ? `${liability.rate}%` : '-'}</td>
                    <td className="py-3 px-3 text-center text-stone-500 text-xs">{liability.frequency || '-'}</td>
                    <td className="py-3 px-3 text-center text-stone-500 text-xs">
                      {liability.nextPaymentDate ? new Date(liability.nextPaymentDate).toLocaleDateString('ru-RU') : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge
                        status={liability.status === 'active' ? 'warning' : liability.status === 'paid' ? 'ok' : 'critical'}
                        size="sm"
                        label={liability.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Valuations Table */}
      {activeTab === 'valuations' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Объект' : 'Object'}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Стоимость' : 'Value'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Метод' : 'Method'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'На дату' : 'As-of'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Источник' : 'Source'}</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">{locale === 'ru' ? 'Статус' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {seedData.valuations.map((val: { id: string; objectId: string; value: number; currency: string; method: string; asOf: string; sourceType?: string; status: string }) => {
                  const holding = holdings.find(h => h.id === val.objectId);
                  return (
                    <tr key={val.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-3 px-3 font-medium text-stone-800">{holding?.name || val.objectId}</td>
                      <td className="py-3 px-3 text-right font-medium text-stone-800">{formatCurrency(val.value, val.currency)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600 capitalize">
                          {val.method}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-stone-500 text-xs">{new Date(val.asOf).toLocaleDateString('ru-RU')}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                          {val.sourceType || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge
                          status={val.status === 'priced' || val.status === 'estimated' ? 'ok' : 'warning'}
                          size="sm"
                          label={val.status}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recon Issues */}
      {activeTab === 'recon' && !clientSafe && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          {reconIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-stone-600 font-medium">{locale === 'ru' ? 'Нет расхождений' : 'No discrepancies'}</p>
              <p className="text-stone-400 text-sm mt-1">{locale === 'ru' ? 'Все данные сверены' : 'All data reconciled'}</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {reconIssues.map(holding => (
                <div key={holding.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-stone-800">{holding.name}</span>
                    <p className="text-sm text-stone-500 mt-0.5">
                      {locale === 'ru' ? 'Обнаружено расхождение' : 'Discrepancy found'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="critical" label="Issue" />
                    <Button variant="secondary" size="sm" onClick={() => router.push(`/m/net-worth/item/${holding.id}`)}>
                      {locale === 'ru' ? 'Открыть' : 'Open'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

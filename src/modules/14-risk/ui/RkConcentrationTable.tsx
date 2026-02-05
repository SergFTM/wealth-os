"use client";

import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface Concentration {
  id: string;
  portfolioId: string;
  type: string;
  name: string;
  identifier: string;
  weight: number;
  limit: number;
  status: 'ok' | 'warning' | 'breached';
  marketValue: number;
  asOfDate: string;
}

interface RkConcentrationTableProps {
  concentrations: Concentration[];
  onRowClick?: (concentration: Concentration) => void;
  showOnlyBreaches?: boolean;
}

const typeLabels: Record<string, string> = {
  singlePosition: 'Позиция',
  issuer: 'Эмитент',
  sector: 'Сектор',
  country: 'Страна',
  currency: 'Валюта',
  counterparty: 'Контрагент',
  liquidity: 'Ликвидность',
  maturity: 'Срок погашения',
  creditRating: 'Кредитный рейтинг',
  strategy: 'Стратегия',
};

const statusConfig = {
  ok: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'OK' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Внимание' },
  breached: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', label: 'Нарушение' },
};

export function RkConcentrationTable({ concentrations, onRowClick, showOnlyBreaches }: RkConcentrationTableProps) {
  const filteredConcentrations = showOnlyBreaches
    ? concentrations.filter(c => c.status !== 'ok')
    : concentrations;

  const sortedConcentrations = [...filteredConcentrations].sort((a, b) => {
    // Sort by status priority (breached first), then by weight
    const statusPriority = { breached: 0, warning: 1, ok: 2 };
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    return b.weight - a.weight;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Название</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Вес</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Лимит</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Стоимость</th>
            </tr>
          </thead>
          <tbody>
            {sortedConcentrations.map((conc) => {
              const config = statusConfig[conc.status];
              const Icon = config.icon;
              const excess = conc.weight - conc.limit;

              return (
                <tr
                  key={conc.id}
                  onClick={() => onRowClick?.(conc)}
                  className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors ${
                    conc.status === 'breached' ? 'bg-red-50/50' : conc.status === 'warning' ? 'bg-amber-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-stone-800">{conc.name}</div>
                      <div className="text-xs text-stone-500">{conc.identifier}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-md">
                      {typeLabels[conc.type] || conc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-2 bg-stone-100 rounded-full overflow-hidden relative">
                        {/* Limit marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-stone-400 z-10"
                          style={{ left: `${Math.min(conc.limit, 100)}%` }}
                        />
                        {/* Weight bar */}
                        <div
                          className={`h-full rounded-full ${
                            conc.status === 'breached' ? 'bg-red-500' :
                            conc.status === 'warning' ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(conc.weight, 100)}%` }}
                        />
                      </div>
                      <span className={`font-medium w-14 text-right ${
                        conc.status === 'breached' ? 'text-red-600' :
                        conc.status === 'warning' ? 'text-amber-600' :
                        'text-stone-800'
                      }`}>
                        {conc.weight.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">
                    {conc.limit.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${config.bg} ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {conc.status === 'breached' && excess > 0 && `+${excess.toFixed(1)}%`}
                        {conc.status === 'warning' && 'Близко'}
                        {conc.status === 'ok' && 'OK'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">
                    ${(conc.marketValue / 1000000).toFixed(2)}M
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedConcentrations.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          {showOnlyBreaches ? 'Нет нарушений концентрации' : 'Нет данных для отображения'}
        </div>
      )}
    </div>
  );
}

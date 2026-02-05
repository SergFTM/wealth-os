"use client";

import { CheckCircle, AlertCircle, Clock, MapPin } from 'lucide-react';

interface Trust {
  id: string;
  clientId: string;
  name: string;
  jurisdiction: string;
  trustType: 'revocable' | 'irrevocable';
  settlor: string;
  status: 'active' | 'inactive' | 'terminated';
  primaryTrusteeId: string;
  protectorId: string | null;
  fundingDate: string;
  purpose: string;
  governingLaw: string;
  totalAssets: number;
  currency: string;
  notes: string | null;
}

interface TrTrustsTableProps {
  trusts: Trust[];
  onRowClick?: (trust: Trust) => void;
}

const statusConfig = {
  active: { label: 'Активен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  inactive: { label: 'Неактивен', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  terminated: { label: 'Закрыт', color: 'text-stone-500', bg: 'bg-stone-100', Icon: AlertCircle },
};

const trustTypeConfig = {
  revocable: { label: 'Отзывный', color: 'text-blue-600', bg: 'bg-blue-50' },
  irrevocable: { label: 'Безотзывный', color: 'text-purple-600', bg: 'bg-purple-50' },
};

const jurisdictionLabels: Record<string, string> = {
  'US-DE': 'Delaware, США',
  'US-SD': 'South Dakota, США',
  'US-CA': 'California, США',
  'GB': 'Великобритания',
  'JE': 'Jersey',
  'SG': 'Сингапур',
  'HK': 'Гонконг',
};

export function TrTrustsTable({ trusts, onRowClick }: TrTrustsTableProps) {
  const formatCurrency = (value: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      GBP: '£',
      SGD: 'S$',
      HKD: 'HK$',
    };
    const symbol = symbols[currency] || currency;
    if (value >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(1)}M`;
    }
    return `${symbol}${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Траст</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Юрисдикция</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Settlor</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Активы</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Дата созд.</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
            </tr>
          </thead>
          <tbody>
            {trusts.map((trust) => {
              const status = statusConfig[trust.status];
              const trustType = trustTypeConfig[trust.trustType];
              const StatusIcon = status.Icon;

              return (
                <tr
                  key={trust.id}
                  onClick={() => onRowClick?.(trust)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-stone-800">{trust.name}</div>
                    <div className="text-xs text-stone-500 line-clamp-1">{trust.purpose}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-stone-700">
                        {jurisdictionLabels[trust.jurisdiction] || trust.jurisdiction}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">{trust.governingLaw}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${trustType.bg} ${trustType.color}`}>
                      {trustType.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {trust.settlor}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-semibold text-stone-800">
                      {formatCurrency(trust.totalAssets, trust.currency)}
                    </div>
                    <div className="text-xs text-stone-500">{trust.currency}</div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(trust.fundingDate).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {trusts.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет трастов для отображения
        </div>
      )}
    </div>
  );
}

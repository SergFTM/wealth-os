"use client";

import { TrendingUp, TrendingDown, Minus, Calculator, DollarSign, Calendar, FileText, Leaf, AlertTriangle } from 'lucide-react';

interface KpiItem {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'amber' | 'red' | 'emerald';
}

interface TxKpiStripProps {
  items?: KpiItem[];
}

const defaultKpis: KpiItem[] = [
  { id: 'realizedGains', label: 'Реализованная прибыль YTD', value: '₽2,450,000', trend: 'up', trendValue: '+₽350K', color: 'emerald' },
  { id: 'unrealizedGains', label: 'Нереализованная прибыль', value: '₽5,120,000', trend: 'up', trendValue: '+12%', color: 'default' },
  { id: 'harvestingPotential', label: 'Потенциал харвестинга', value: '₽890,000', trend: 'neutral', color: 'amber' },
  { id: 'pendingDeadlines', label: 'Ближайших дедлайнов', value: '3', trend: 'up', trendValue: '+1', color: 'red' },
  { id: 'shortTermGains', label: 'Краткосрочная прибыль', value: '₽680,000', trend: 'down', trendValue: '-15%', color: 'default' },
  { id: 'longTermGains', label: 'Долгосрочная прибыль', value: '₽1,770,000', trend: 'up', trendValue: '+8%', color: 'emerald' },
  { id: 'taxLiability', label: 'Расчётный налог', value: '₽485,000', trend: 'up', trendValue: '+₽45K', color: 'amber' },
  { id: 'advisorPacks', label: 'Пакетов для консультанта', value: '2', trend: 'neutral', color: 'default' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  realizedGains: DollarSign,
  unrealizedGains: TrendingUp,
  harvestingPotential: Leaf,
  pendingDeadlines: Calendar,
  shortTermGains: Calculator,
  longTermGains: Calculator,
  taxLiability: AlertTriangle,
  advisorPacks: FileText,
};

export function TxKpiStrip({ items = defaultKpis }: TxKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.id] || Calculator;
        const TrendIcon = item.trend === 'up' ? TrendingUp : item.trend === 'down' ? TrendingDown : Minus;

        const colorClasses = {
          default: 'bg-stone-50 border-stone-200',
          amber: 'bg-amber-50 border-amber-200',
          red: 'bg-red-50 border-red-200',
          emerald: 'bg-emerald-50 border-emerald-200',
        };

        const valueColors = {
          default: 'text-stone-800',
          amber: 'text-amber-700',
          red: 'text-red-700',
          emerald: 'text-emerald-700',
        };

        const iconColors = {
          default: 'text-stone-400',
          amber: 'text-amber-500',
          red: 'text-red-500',
          emerald: 'text-emerald-500',
        };

        const trendColors = {
          up: item.color === 'amber' || item.color === 'red' ? 'text-red-500' : 'text-emerald-500',
          down: item.id === 'taxLiability' ? 'text-emerald-500' : 'text-red-500',
          neutral: 'text-stone-400',
        };

        return (
          <div
            key={item.id}
            className={`p-4 rounded-xl border ${colorClasses[item.color || 'default']} transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-5 h-5 ${iconColors[item.color || 'default']}`} />
              {item.trendValue && (
                <div className={`flex items-center gap-1 text-xs font-medium ${trendColors[item.trend]}`}>
                  <TrendIcon className="w-3 h-3" />
                  {item.trendValue}
                </div>
              )}
            </div>
            <div className={`text-2xl font-bold ${valueColors[item.color || 'default']} mb-1`}>
              {item.value}
            </div>
            <div className="text-xs text-stone-500">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

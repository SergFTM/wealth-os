"use client";

import { TrendingUp, TrendingDown, Minus, Shield, AlertTriangle, Activity, Target } from 'lucide-react';

interface KpiItem {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'amber' | 'red' | 'emerald';
}

interface RkKpiStripProps {
  items?: KpiItem[];
}

const defaultKpis: KpiItem[] = [
  { id: 'var', label: 'VaR портфеля (95%)', value: '2.4%', trend: 'down', trendValue: '-0.3%', color: 'default' },
  { id: 'alerts', label: 'Активных алертов', value: '7', trend: 'up', trendValue: '+2', color: 'amber' },
  { id: 'concentration', label: 'Индекс концентрации', value: '0.078', trend: 'neutral', color: 'default' },
  { id: 'stress', label: 'Стресс-тестов', value: '12', trend: 'up', trendValue: '+3', color: 'default' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  var: Shield,
  alerts: AlertTriangle,
  concentration: Target,
  stress: Activity,
};

export function RkKpiStrip({ items = defaultKpis }: RkKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.id] || Shield;
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

        const trendColors = {
          up: item.color === 'amber' || item.color === 'red' ? 'text-red-500' : 'text-emerald-500',
          down: 'text-emerald-500',
          neutral: 'text-stone-400',
        };

        return (
          <div
            key={item.id}
            className={`p-4 rounded-xl border ${colorClasses[item.color || 'default']} transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-5 h-5 ${item.color === 'amber' ? 'text-amber-500' : item.color === 'red' ? 'text-red-500' : 'text-stone-400'}`} />
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

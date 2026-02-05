"use client";

import { Landmark, Users, Wallet, Clock, Calendar, UserCheck, FileText, Bell } from 'lucide-react';

interface KpiItem {
  id: string;
  label: string;
  value: string;
  color?: 'default' | 'amber' | 'red' | 'emerald';
}

interface TrKpiStripProps {
  items?: KpiItem[];
}

const defaultKpis: KpiItem[] = [
  { id: 'trustsActive', label: 'Активных трастов', value: '8', color: 'default' },
  { id: 'beneficiariesCount', label: 'Бенефициаров', value: '30', color: 'default' },
  { id: 'distributionsScheduled90d', label: 'Распределений 90д', value: '12', color: 'default' },
  { id: 'distributionsPending', label: 'Ожидают одобрения', value: '8', color: 'amber' },
  { id: 'eventsUpcoming60d', label: 'Событий 60д', value: '5', color: 'default' },
  { id: 'trusteeChanges1y', label: 'Смен trustee 1г', value: '2', color: 'default' },
  { id: 'missingDocs', label: 'Нет документов', value: '3', color: 'red' },
  { id: 'calendarTriggers30d', label: 'Триггеры 30д', value: '6', color: 'amber' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trustsActive: Landmark,
  beneficiariesCount: Users,
  distributionsScheduled90d: Wallet,
  distributionsPending: Clock,
  eventsUpcoming60d: Calendar,
  trusteeChanges1y: UserCheck,
  missingDocs: FileText,
  calendarTriggers30d: Bell,
};

export function TrKpiStrip({ items = defaultKpis }: TrKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.id] || Landmark;

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

        return (
          <div
            key={item.id}
            className={`p-4 rounded-xl border ${colorClasses[item.color || 'default']} transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-5 h-5 ${iconColors[item.color || 'default']}`} />
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

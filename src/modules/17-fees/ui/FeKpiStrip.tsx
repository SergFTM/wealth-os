"use client";

import { FileText, Calculator, Clock, AlertTriangle, DollarSign, CheckCircle, CreditCard, BookOpen } from 'lucide-react';

interface KpiItem {
  id: string;
  label: string;
  value: string;
  color?: 'default' | 'amber' | 'red' | 'emerald';
}

interface FeKpiStripProps {
  items?: KpiItem[];
}

const defaultKpis: KpiItem[] = [
  { id: 'contractsActive', label: 'Активные договоры', value: '20', color: 'default' },
  { id: 'feeRunsQuarter', label: 'Расчётов за квартал', value: '6', color: 'default' },
  { id: 'invoicesDraft', label: 'Черновики счетов', value: '4', color: 'amber' },
  { id: 'invoicesPendingApproval', label: 'Ожидают одобрения', value: '8', color: 'amber' },
  { id: 'arOutstanding', label: 'Неоплаченная AR', value: '$485,000', color: 'amber' },
  { id: 'invoicesOverdue', label: 'Просроченных счетов', value: '6', color: 'red' },
  { id: 'paymentsReceived30d', label: 'Получено 30д', value: '$380,000', color: 'emerald' },
  { id: 'glPostingPending', label: 'GL не проведено', value: '12', color: 'amber' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  contractsActive: FileText,
  feeRunsQuarter: Calculator,
  invoicesDraft: Clock,
  invoicesPendingApproval: AlertTriangle,
  arOutstanding: DollarSign,
  invoicesOverdue: AlertTriangle,
  paymentsReceived30d: CheckCircle,
  glPostingPending: BookOpen,
};

export function FeKpiStrip({ items = defaultKpis }: FeKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.id] || CreditCard;

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
            className={`p-4 rounded-xl border ${colorClasses[item.color || 'default']} transition-all hover:shadow-md cursor-pointer`}
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

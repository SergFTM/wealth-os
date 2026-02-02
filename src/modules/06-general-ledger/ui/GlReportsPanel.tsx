"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  name: string;
  description: string;
  icon: string;
  status?: 'ready' | 'placeholder';
}

const defaultReports: Report[] = [
  { id: 'pl', name: 'P&L', description: 'Отчёт о прибылях и убытках', icon: '📊', status: 'ready' },
  { id: 'balance', name: 'Balance Sheet', description: 'Балансовый отчёт', icon: '📈', status: 'ready' },
  { id: 'cashflow', name: 'Cash Flow', description: 'Движение денежных средств', icon: '💧', status: 'ready' },
  { id: 'trial_balance', name: 'Trial Balance', description: 'Оборотно-сальдовая ведомость', icon: '📋', status: 'ready' },
  { id: 'capital_gains', name: 'Capital Gains', description: 'Прибыли/убытки по активам', icon: '📉', status: 'placeholder' }
];

interface GlReportsPanelProps {
  reports?: Report[];
  onSelect?: (reportId: string) => void;
}

export function GlReportsPanel({ reports = defaultReports, onSelect }: GlReportsPanelProps) {
  const router = useRouter();

  const handleSelect = (reportId: string) => {
    if (onSelect) {
      onSelect(reportId);
    } else {
      router.push(`/m/general-ledger/list?tab=reports&report=${reportId}`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200">
        <h3 className="font-semibold text-stone-800">Отчёты</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-4">
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => handleSelect(report.id)}
            disabled={report.status === 'placeholder'}
            className={cn(
              "p-4 rounded-lg border text-left transition-all",
              report.status === 'placeholder'
                ? "bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed"
                : "bg-gradient-to-br from-white to-stone-50 border-stone-200 hover:border-emerald-300 hover:shadow-md cursor-pointer"
            )}
          >
            <span className="text-2xl mb-2 block">{report.icon}</span>
            <p className="font-medium text-stone-800 text-sm">{report.name}</p>
            <p className="text-xs text-stone-500 mt-1">{report.description}</p>
            {report.status === 'placeholder' && (
              <span className="text-xs text-amber-600 mt-2 block">Coming soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

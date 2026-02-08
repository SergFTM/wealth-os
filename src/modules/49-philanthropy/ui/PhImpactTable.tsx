"use client";

import { PhStatusPill } from './PhStatusPill';

interface PhilImpactReport {
  id: string;
  grantId: string;
  grantName?: string;
  granteeName?: string;
  periodStart: string;
  periodEnd: string;
  statusKey: string;
  metricsJson?: {
    beneficiaries?: number;
    projectsCompleted?: number;
  };
  clientSafePublished?: boolean;
}

interface PhImpactTableProps {
  reports: PhilImpactReport[];
  onRowClick?: (report: PhilImpactReport) => void;
  emptyMessage?: string;
}

export function PhImpactTable({ reports, onRowClick, emptyMessage = 'Нет отчетов' }: PhImpactTableProps) {
  if (reports.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    const endDate = new Date(end).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    return `${startDate} — ${endDate}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Грант</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Период</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Бенефициаров</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Проектов</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Client-safe</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {reports.map((report) => (
            <tr
              key={report.id}
              onClick={() => onRowClick?.(report)}
              className="hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div>
                  <span className="font-medium text-stone-900">{report.granteeName || report.grantName || report.grantId}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-stone-600">{formatPeriod(report.periodStart, report.periodEnd)}</td>
              <td className="px-4 py-3 text-center">
                <PhStatusPill status={report.statusKey} type="impact" />
              </td>
              <td className="px-4 py-3 text-center text-stone-700 font-mono">
                {report.metricsJson?.beneficiaries?.toLocaleString('ru-RU') || '—'}
              </td>
              <td className="px-4 py-3 text-center text-stone-700 font-mono">
                {report.metricsJson?.projectsCompleted || '—'}
              </td>
              <td className="px-4 py-3 text-center">
                {report.clientSafePublished ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    ✓ Опубликован
                  </span>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

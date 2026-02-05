'use client';

import { useRouter } from 'next/navigation';
import { ideasConfig } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface KpiData {
  ideasActive: number;
  ideasPendingCommittee: number;
  watchlistsCount: number;
  notesLast30d: number;
  memosGenerated30d: number;
  highRiskIdeas: number;
  outcomesTracked: number;
  missingSources: number;
}

interface IdKpiStripProps {
  data: KpiData;
  locale?: Locale;
}

export function IdKpiStrip({ data, locale = 'ru' }: IdKpiStripProps) {
  const router = useRouter();
  const kpis = ideasConfig.kpis || [];

  const getValue = (key: string): number => {
    return data[key as keyof KpiData] || 0;
  };

  const getLink = (key: string): string => {
    const links: Record<string, string> = {
      ideasActive: '/m/ideas/list?tab=ideas&status=active',
      ideasPendingCommittee: '/m/ideas/list?tab=committee&filter=pending',
      watchlistsCount: '/m/ideas/list?tab=watchlists',
      notesLast30d: '/m/ideas/list?tab=notes&period=30d',
      memosGenerated30d: '/m/ideas/list?tab=memos&period=30d',
      highRiskIdeas: '/m/ideas/list?tab=ideas&filter=high_risk',
      outcomesTracked: '/m/ideas/list?tab=outcomes',
      missingSources: '/m/ideas/list?tab=ideas&filter=missing_sources',
    };
    return links[key] || '/m/ideas/list';
  };

  const statusColors: Record<string, string> = {
    ok: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50',
    warning: 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
    critical: 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50',
    info: 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50',
  };

  const textColors: Record<string, string> = {
    ok: 'text-emerald-700',
    warning: 'text-amber-700',
    critical: 'text-red-700',
    info: 'text-blue-700',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => {
        const value = getValue(kpi.key);
        const status = kpi.status || 'info';

        return (
          <button
            key={kpi.key}
            onClick={() => router.push(getLink(kpi.key))}
            className={`
              p-3 rounded-xl border backdrop-blur-sm
              transition-all duration-200 hover:scale-[1.02] hover:shadow-md
              text-left cursor-pointer
              ${statusColors[status]}
            `}
          >
            <div className={`text-2xl font-bold ${textColors[status]}`}>
              {value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
              {kpi.title[locale] || kpi.title.ru}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default IdKpiStrip;

'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Play } from 'lucide-react';
import { DlStatusPill } from './DlStatusPill';

interface CorporateAction {
  id: string;
  effectiveAt: string;
  assetKey: string;
  assetName: string;
  actionType: string;
  termsJson: string;
  status: string;
}

interface DlCorporateActionsTableProps {
  actions: CorporateAction[];
  compact?: boolean;
  onApply?: (actionId: string) => void;
}

const actionTypeLabels: Record<string, string> = {
  dividend: 'Дивиденд',
  split: 'Сплит',
  merger: 'Слияние',
  'spin-off': 'Спин-офф',
  'rights-issue': 'Права',
  tender: 'Тендер'
};

export function DlCorporateActionsTable({ actions, compact = false, onApply }: DlCorporateActionsTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: compact ? undefined : 'numeric'
    });
  };

  const parseTerms = (termsJson: string) => {
    try {
      return JSON.parse(termsJson);
    } catch {
      return {};
    }
  };

  const getTermsSummary = (actionType: string, termsJson: string) => {
    const terms = parseTerms(termsJson);
    switch (actionType) {
      case 'dividend':
        return `$${terms.amountPerShare || 0}/акция`;
      case 'split':
        return `${terms.ratio || 1}:1`;
      case 'merger':
        return `Коэфф. ${terms.exchangeRatio || 1}`;
      case 'spin-off':
        return `${(terms.ratio || 0) * 100}%`;
      default:
        return '—';
    }
  };

  const handleRowClick = (actionId: string) => {
    router.push(`/m/deals/action/${actionId}`);
  };

  const sortedActions = [...actions].sort((a, b) =>
    new Date(a.effectiveAt).getTime() - new Date(b.effectiveAt).getTime()
  );

  if (compact) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Дата</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Актив</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Тип</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Статус</th>
            </tr>
          </thead>
          <tbody>
            {sortedActions.slice(0, 5).map(action => (
              <tr
                key={action.id}
                onClick={() => handleRowClick(action.id)}
                className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-2 text-sm text-slate-600">{formatDate(action.effectiveAt)}</td>
                <td className="px-4 py-2 text-sm font-medium text-slate-900">{action.assetKey}</td>
                <td className="px-4 py-2 text-sm text-slate-700">{actionTypeLabels[action.actionType] || action.actionType}</td>
                <td className="px-4 py-2">
                  <DlStatusPill status={action.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Символ</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Актив</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Условия</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody>
          {sortedActions.map(action => (
            <tr
              key={action.id}
              onClick={() => handleRowClick(action.id)}
              className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 text-sm text-slate-600">{formatDate(action.effectiveAt)}</td>
              <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{action.assetKey}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{action.assetName}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {actionTypeLabels[action.actionType] || action.actionType}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {getTermsSummary(action.actionType, action.termsJson)}
              </td>
              <td className="px-4 py-3">
                <DlStatusPill status={action.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {(action.status === 'planned' || action.status === 'announced') && onApply && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApply(action.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                    >
                      <Play className="h-3 w-3" />
                      Применить
                    </button>
                  )}
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

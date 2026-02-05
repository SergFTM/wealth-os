'use client';

/**
 * Planning Plan vs Actual Table Component
 * Compares planned cashflows to actual transactions
 */

import { useI18n } from '@/lib/i18n';
import { PlanActualLink, getGapStatus, GAP_STATUS_CONFIG } from '../schema/planActualLink';
import { PlStatusPill } from './PlStatusPill';

interface PlPlanVsActualTableProps {
  links: PlanActualLink[];
  lang?: 'ru' | 'en' | 'uk';
  onExplain?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function PlPlanVsActualTable({
  links,
  lang: propLang,
  onExplain,
  onViewDetails,
}: PlPlanVsActualTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    item: { ru: 'Статья', en: 'Item', uk: 'Стаття' },
    category: { ru: 'Категория', en: 'Category', uk: 'Категорія' },
    planned: { ru: 'План', en: 'Planned', uk: 'План' },
    actual: { ru: 'Факт', en: 'Actual', uk: 'Факт' },
    gap: { ru: 'Разница', en: 'Gap', uk: 'Різниця' },
    gapPct: { ru: '%', en: '%', uk: '%' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    explained: { ru: 'Пояснено', en: 'Explained', uk: 'Пояснено' },
  };

  const actions = {
    explain: { ru: 'Пояснить', en: 'Explain', uk: 'Пояснити' },
    details: { ru: 'Детали', en: 'Details', uk: 'Деталі' },
  };

  const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;

  const getGapColor = (gapPct: number): string => {
    const absGap = Math.abs(gapPct);
    if (absGap <= 5) return 'text-green-600';
    if (absGap <= 15) return 'text-amber-600';
    return 'text-red-600';
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {lang === 'ru' ? 'Нет данных план/факт' : lang === 'uk' ? 'Немає даних план/факт' : 'No plan vs actual data'}
      </div>
    );
  }

  // Calculate totals
  const totalPlanned = links.reduce((sum, l) => sum + l.plannedAmount, 0);
  const totalActual = links.reduce((sum, l) => sum + l.actualAmount, 0);
  const totalGap = totalActual - totalPlanned;
  const totalGapPct = totalPlanned !== 0 ? Math.round((totalGap / Math.abs(totalPlanned)) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.item[lang]}</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.category[lang]}</th>
              <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.planned[lang]}</th>
              <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.actual[lang]}</th>
              <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.gap[lang]}</th>
              <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.gapPct[lang]}</th>
              <th className="text-center py-3 px-2 font-medium text-gray-600">{headers.status[lang]}</th>
              <th className="text-center py-3 px-2 font-medium text-gray-600">{headers.explained[lang]}</th>
              <th className="text-right py-3 px-2 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => {
              const status = getGapStatus(link.gapPct);

              return (
                <tr
                  key={link.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2">
                    <span className="font-medium text-gray-900">{link.planItemTitle}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{link.planCategory}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatCurrency(link.plannedAmount)}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatCurrency(link.actualAmount)}</td>
                  <td className={`py-3 px-2 text-right font-mono ${getGapColor(link.gapPct)}`}>
                    {link.gapAmount >= 0 ? '+' : ''}{formatCurrency(link.gapAmount)}
                  </td>
                  <td className={`py-3 px-2 text-right ${getGapColor(link.gapPct)}`}>
                    {link.gapPct >= 0 ? '+' : ''}{link.gapPct}%
                  </td>
                  <td className="py-3 px-2 text-center">
                    <PlStatusPill status={status} type="gap" lang={lang} size="sm" />
                  </td>
                  <td className="py-3 px-2 text-center">
                    {link.explained ? (
                      <span className="text-green-600" title={link.explanationNote || ''}>✓</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex gap-1 justify-end">
                      {!link.explained && status !== 'ok' && onExplain && (
                        <button
                          onClick={() => onExplain(link.id)}
                          className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          {actions.explain[lang]}
                        </button>
                      )}
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(link.id)}
                          className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          {actions.details[lang]}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-medium">
              <td className="py-3 px-2" colSpan={2}>
                {lang === 'ru' ? 'Итого' : lang === 'uk' ? 'Разом' : 'Total'}
              </td>
              <td className="py-3 px-2 text-right font-mono">{formatCurrency(totalPlanned)}</td>
              <td className="py-3 px-2 text-right font-mono">{formatCurrency(totalActual)}</td>
              <td className={`py-3 px-2 text-right font-mono ${getGapColor(totalGapPct)}`}>
                {totalGap >= 0 ? '+' : ''}{formatCurrency(totalGap)}
              </td>
              <td className={`py-3 px-2 text-right ${getGapColor(totalGapPct)}`}>
                {totalGapPct >= 0 ? '+' : ''}{totalGapPct}%
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-xs text-blue-600 mb-1">{headers.planned[lang]}</div>
          <div className="text-lg font-semibold text-blue-900">{formatCurrency(totalPlanned)}</div>
        </div>
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="text-xs text-green-600 mb-1">{headers.actual[lang]}</div>
          <div className="text-lg font-semibold text-green-900">{formatCurrency(totalActual)}</div>
        </div>
        <div className={`p-3 rounded-lg ${totalGap >= 0 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border`}>
          <div className={`text-xs ${totalGap >= 0 ? 'text-amber-600' : 'text-red-600'} mb-1`}>
            {headers.gap[lang]}
          </div>
          <div className={`text-lg font-semibold ${totalGap >= 0 ? 'text-amber-900' : 'text-red-900'}`}>
            {totalGap >= 0 ? '+' : ''}{formatCurrency(totalGap)} ({totalGapPct >= 0 ? '+' : ''}{totalGapPct}%)
          </div>
        </div>
      </div>
    </div>
  );
}

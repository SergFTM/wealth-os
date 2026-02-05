'use client';

/**
 * Planning Run Detail Component
 * Detailed view of a planning run with projections
 */

import { useI18n } from '@/lib/i18n';
import { PlanningRun } from '../schema/planningRun';
import { SCENARIO_CONFIG } from '../schema/scenario';
import { PlStatusPill } from './PlStatusPill';
import { PlProjectionChart } from './PlProjectionChart';
import { PlSourceBadge } from './PlSourceBadge';

interface PlRunDetailProps {
  run: PlanningRun;
  lang?: 'ru' | 'en' | 'uk';
  onRerun?: () => void;
  onCompare?: () => void;
}

export function PlRunDetail({ run, lang: propLang, onRerun, onCompare }: PlRunDetailProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const labels = {
    runDetails: { ru: 'Детали расчёта', en: 'Run Details', uk: 'Деталі розрахунку' },
    scenario: { ru: 'Сценарий', en: 'Scenario', uk: 'Сценарій' },
    runDate: { ru: 'Дата расчёта', en: 'Run Date', uk: 'Дата розрахунку' },
    horizon: { ru: 'Горизонт', en: 'Horizon', uk: 'Горизонт' },
    startYear: { ru: 'Начальный год', en: 'Start Year', uk: 'Початковий рік' },
    metrics: { ru: 'Метрики', en: 'Metrics', uk: 'Метрики' },
    terminalNetWorth: { ru: 'Итоговый капитал', en: 'Terminal Net Worth', uk: 'Підсумковий капітал' },
    minLiquidityYear: { ru: 'Мин. ликвидность (год)', en: 'Min Liquidity Year', uk: 'Мін. ліквідність (рік)' },
    avgAnnualReturn: { ru: 'Сред. годовая доходность', en: 'Avg Annual Return', uk: 'Сер. річна доходність' },
    cashflowSummary: { ru: 'Сводка денежных потоков', en: 'Cashflow Summary', uk: 'Зведення грошових потоків' },
    totalInflows: { ru: 'Всего поступлений', en: 'Total Inflows', uk: 'Усього надходжень' },
    totalOutflows: { ru: 'Всего расходов', en: 'Total Outflows', uk: 'Усього витрат' },
    netCashflow: { ru: 'Чистый поток', en: 'Net Cashflow', uk: 'Чистий потік' },
    projection: { ru: 'Прогноз капитала', en: 'Net Worth Projection', uk: 'Прогноз капіталу' },
    projectionTable: { ru: 'Таблица прогноза', en: 'Projection Table', uk: 'Таблиця прогнозу' },
    rerun: { ru: 'Пересчитать', en: 'Rerun', uk: 'Перерахувати' },
    compare: { ru: 'Сравнить', en: 'Compare', uk: 'Порівняти' },
    years: { ru: 'лет', en: 'years', uk: 'років' },
    year: { ru: 'Год', en: 'Year', uk: 'Рік' },
    netWorth: { ru: 'Капитал', en: 'Net Worth', uk: 'Капітал' },
    liquidAssets: { ru: 'Ликвидные', en: 'Liquid', uk: 'Ліквідні' },
    investedAssets: { ru: 'Инвестиции', en: 'Invested', uk: 'Інвестиції' },
    netCashflowYear: { ru: 'Чистый CF', en: 'Net CF', uk: 'Чистий CF' },
  };

  const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;
  const formatPct = (val: number): string => `${val.toFixed(1)}%`;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const scenarioType = run.scenarioType || 'base';
  const scenarioConfig = SCENARIO_CONFIG[scenarioType];
  const startYear = run.projections.length > 0 ? run.projections[0].year : new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{labels.runDetails[lang]}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span>{scenarioConfig.icon}</span>
                  <PlStatusPill status={scenarioType} type="scenario" lang={lang} size="sm" />
                </span>
                <span>•</span>
                <span>{formatDate(run.runAt)}</span>
              </div>
            </div>
            <PlSourceBadge source="calculated" asOfDate={run.runAt} lang={lang} />
          </div>
        </div>

        {/* Run Parameters */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50">
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.scenario[lang]}</div>
            <div className="font-medium">{scenarioConfig.label[lang]}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.startYear[lang]}</div>
            <div className="font-medium">{startYear}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.horizon[lang]}</div>
            <div className="font-medium">{run.horizonYears} {labels.years[lang]}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.runDate[lang]}</div>
            <div className="text-sm">{formatDate(run.runAt)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
          {onRerun && (
            <button
              onClick={onRerun}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {labels.rerun[lang]}
            </button>
          )}
          {onCompare && (
            <button
              onClick={onCompare}
              className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              {labels.compare[lang]}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">{labels.terminalNetWorth[lang]}</div>
          <div className="text-2xl font-semibold text-gray-900">
            {formatCurrency(run.metrics.terminalNetWorth)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">{labels.minLiquidityYear[lang]}</div>
          <div className="text-2xl font-semibold">
            {run.metrics.minLiquidityYear || '—'}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">{labels.avgAnnualReturn[lang]}</div>
          <div className="text-2xl font-semibold text-green-600">
            {formatPct(run.metrics.averageAnnualReturn * 100)}
          </div>
        </div>
      </div>

      {/* Cashflow Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">{labels.cashflowSummary[lang]}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="text-xs text-green-600 mb-1">{labels.totalInflows[lang]}</div>
            <div className="text-lg font-semibold text-green-900">
              +{formatCurrency(run.cashflowSummary.totalInflows)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="text-xs text-red-600 mb-1">{labels.totalOutflows[lang]}</div>
            <div className="text-lg font-semibold text-red-900">
              -{formatCurrency(run.cashflowSummary.totalOutflows)}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${
            run.cashflowSummary.netCashflow >= 0
              ? 'bg-blue-50 border-blue-200'
              : 'bg-amber-50 border-amber-200'
          } border`}>
            <div className={`text-xs ${
              run.cashflowSummary.netCashflow >= 0 ? 'text-blue-600' : 'text-amber-600'
            } mb-1`}>{labels.netCashflow[lang]}</div>
            <div className={`text-lg font-semibold ${
              run.cashflowSummary.netCashflow >= 0 ? 'text-blue-900' : 'text-amber-900'
            }`}>
              {run.cashflowSummary.netCashflow >= 0 ? '+' : ''}
              {formatCurrency(run.cashflowSummary.netCashflow)}
            </div>
          </div>
        </div>
      </div>

      {/* Projection Chart */}
      {run.projections.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">{labels.projection[lang]}</h3>
          <PlProjectionChart projections={run.projections} lang={lang} height={350} />
        </div>
      )}

      {/* Projection Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">{labels.projectionTable[lang]}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-2 px-3 font-medium text-gray-600">{labels.year[lang]}</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">{labels.netWorth[lang]}</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">{labels.liquidAssets[lang]}</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">{labels.investedAssets[lang]}</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">{labels.netCashflowYear[lang]}</th>
              </tr>
            </thead>
            <tbody>
              {run.projections.slice(0, 20).map((proj, idx) => (
                <tr key={proj.year} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3 font-medium">{proj.year}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(proj.netWorth)}</td>
                  <td className="py-2 px-3 text-right font-mono text-gray-600">{formatCurrency(proj.liquidAssets)}</td>
                  <td className="py-2 px-3 text-right font-mono text-gray-600">{formatCurrency(proj.investedAssets)}</td>
                  <td className={`py-2 px-3 text-right font-mono ${
                    proj.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {proj.netCashflow >= 0 ? '+' : ''}{formatCurrency(proj.netCashflow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {run.projections.length > 20 && (
          <div className="p-2 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
            {lang === 'ru' ? `Показано 20 из ${run.projections.length} записей` :
             lang === 'uk' ? `Показано 20 з ${run.projections.length} записів` :
             `Showing 20 of ${run.projections.length} entries`}
          </div>
        )}
      </div>
    </div>
  );
}

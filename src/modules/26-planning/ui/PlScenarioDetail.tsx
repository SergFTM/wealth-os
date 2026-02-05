'use client';

/**
 * Planning Scenario Detail Component
 * Detailed view with projection chart
 */

import { useI18n } from '@/lib/i18n';
import { PlanningScenario, SCENARIO_CONFIG, SCENARIO_MODIFIERS } from '../schema/scenario';
import { PlanningRun, YearlyProjection } from '../schema/planningRun';
import { PlStatusPill } from './PlStatusPill';
import { PlProjectionChart } from './PlProjectionChart';

interface PlScenarioDetailProps {
  scenario: PlanningScenario;
  latestRun?: PlanningRun;
  lang?: 'ru' | 'en' | 'uk';
  onEdit?: () => void;
  onRunScenario?: () => void;
}

export function PlScenarioDetail({
  scenario,
  latestRun,
  lang: propLang,
  onEdit,
  onRunScenario,
}: PlScenarioDetailProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const labels = {
    type: { ru: 'Тип сценария', en: 'Scenario Type', uk: 'Тип сценарію' },
    returnMod: { ru: 'Модификатор доходности', en: 'Return Modifier', uk: 'Модифікатор доходності' },
    inflationMod: { ru: 'Модификатор инфляции', en: 'Inflation Modifier', uk: 'Модифікатор інфляції' },
    shockYear1: { ru: 'Шок 1-го года', en: 'Year 1 Shock', uk: 'Шок 1-го року' },
    terminalNetWorth: { ru: 'Итоговый капитал', en: 'Terminal Net Worth', uk: 'Підсумковий капітал' },
    minLiquidityYear: { ru: 'Мин. ликвидность (год)', en: 'Min Liquidity Year', uk: 'Мін. ліквідність (рік)' },
    runDate: { ru: 'Дата расчёта', en: 'Run Date', uk: 'Дата розрахунку' },
    projection: { ru: 'Прогноз капитала', en: 'Net Worth Projection', uk: 'Прогноз капіталу' },
    assumptions: { ru: 'Допущения', en: 'Assumptions', uk: 'Припущення' },
    edit: { ru: 'Редактировать', en: 'Edit', uk: 'Редагувати' },
    runScenario: { ru: 'Запустить расчёт', en: 'Run Scenario', uk: 'Запустити розрахунок' },
  };

  const config = SCENARIO_CONFIG[scenario.type];
  const modifier = SCENARIO_MODIFIERS[scenario.type];

  const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;
  const formatPct = (val: number): string => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${(val * 100).toFixed(1)}%`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{scenario.name}</h2>
                {scenario.description && (
                  <p className="text-sm text-gray-500">{scenario.description}</p>
                )}
              </div>
            </div>
            <PlStatusPill status={scenario.type} type="scenario" lang={lang} />
          </div>
        </div>

        {/* Modifiers */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.type[lang]}</div>
            <div className="font-medium">{config.label[lang]}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.returnMod[lang]}</div>
            <div className={`font-medium ${modifier.returnMod > 0 ? 'text-green-600' : modifier.returnMod < 0 ? 'text-red-600' : ''}`}>
              {formatPct(modifier.returnMod)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.inflationMod[lang]}</div>
            <div className={`font-medium ${modifier.inflationMod > 0 ? 'text-red-600' : modifier.inflationMod < 0 ? 'text-green-600' : ''}`}>
              {formatPct(modifier.inflationMod)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{labels.shockYear1[lang]}</div>
            <div className={`font-medium ${modifier.shockYear1 < 0 ? 'text-red-600' : ''}`}>
              {modifier.shockYear1 ? formatPct(modifier.shockYear1) : '—'}
            </div>
          </div>
        </div>

        {/* Run Metrics */}
        {latestRun && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">{labels.terminalNetWorth[lang]}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(latestRun.metrics.terminalNetWorth)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{labels.minLiquidityYear[lang]}</div>
                <div className="text-lg font-semibold">
                  {latestRun.metrics.minLiquidityYear || '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{labels.runDate[lang]}</div>
                <div className="text-sm">{formatDate(latestRun.runAt)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
          {onRunScenario && (
            <button
              onClick={onRunScenario}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {labels.runScenario[lang]}
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              {labels.edit[lang]}
            </button>
          )}
        </div>
      </div>

      {/* Projection Chart */}
      {latestRun && latestRun.projections.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">{labels.projection[lang]}</h3>
          <PlProjectionChart projections={latestRun.projections} lang={lang} />
        </div>
      )}
    </div>
  );
}

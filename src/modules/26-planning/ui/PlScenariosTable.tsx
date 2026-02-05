'use client';

/**
 * Planning Scenarios Table Component
 * List of scenarios with comparison metrics
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { PlanningScenario, SCENARIO_CONFIG, SCENARIO_MODIFIERS } from '../schema/scenario';
import { PlStatusPill } from './PlStatusPill';

interface PlScenariosTableProps {
  scenarios: PlanningScenario[];
  lang?: 'ru' | 'en' | 'uk';
  onSelect?: (id: string) => void;
}

export function PlScenariosTable({ scenarios, lang: propLang, onSelect }: PlScenariosTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    name: { ru: 'Сценарий', en: 'Scenario', uk: 'Сценарій' },
    type: { ru: 'Тип', en: 'Type', uk: 'Тип' },
    terminalNW: { ru: 'Итог. NW', en: 'Terminal NW', uk: 'Підс. NW' },
    returnMod: { ru: 'Доходность', en: 'Return Mod', uk: 'Доходність' },
    inflationMod: { ru: 'Инфляция', en: 'Inflation', uk: 'Інфляція' },
    isActive: { ru: 'Активен', en: 'Active', uk: 'Активний' },
  };

  const formatCurrency = (amount: number): string => `$${(amount / 1e6).toFixed(1)}M`;

  const formatModifier = (mod: number): string => {
    if (mod === 0) return '—';
    const sign = mod > 0 ? '+' : '';
    return `${sign}${(mod * 100).toFixed(0)}%`;
  };

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {lang === 'ru' ? 'Нет сценариев' : lang === 'uk' ? 'Немає сценаріїв' : 'No scenarios'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.name[lang]}</th>
            <th className="text-left py-3 px-2 font-medium text-gray-600">{headers.type[lang]}</th>
            <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.terminalNW[lang]}</th>
            <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.returnMod[lang]}</th>
            <th className="text-right py-3 px-2 font-medium text-gray-600">{headers.inflationMod[lang]}</th>
            <th className="text-center py-3 px-2 font-medium text-gray-600">{headers.isActive[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => {
            const config = SCENARIO_CONFIG[scenario.type];
            const modifier = SCENARIO_MODIFIERS[scenario.type];

            return (
              <tr
                key={scenario.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect?.(scenario.id)}
              >
                <td className="py-3 px-2">
                  <Link
                    href={`/m/planning/scenario/${scenario.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="mr-1">{config.icon}</span>
                    {scenario.name}
                  </Link>
                  {scenario.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{scenario.description}</div>
                  )}
                </td>
                <td className="py-3 px-2">
                  <PlStatusPill status={scenario.type} type="scenario" lang={lang} />
                </td>
                <td className="py-3 px-2 text-right font-mono">
                  {scenario.terminalNetWorth
                    ? formatCurrency(scenario.terminalNetWorth)
                    : '—'}
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={modifier.returnMod > 0 ? 'text-green-600' : modifier.returnMod < 0 ? 'text-red-600' : 'text-gray-400'}>
                    {formatModifier(modifier.returnMod)}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={modifier.inflationMod > 0 ? 'text-red-600' : modifier.inflationMod < 0 ? 'text-green-600' : 'text-gray-400'}>
                    {formatModifier(modifier.inflationMod)}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  {scenario.isActive ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

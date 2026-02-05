'use client';

/**
 * Planning Assumptions Panel Component
 * Editable assumptions with defaults
 */

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  PlanningAssumptions,
  DEFAULT_ASSUMPTIONS,
  ASSET_CLASS_RETURNS,
  isAssumptionsStale,
} from '../schema/assumptions';

interface PlAssumptionsPanelProps {
  assumptions: PlanningAssumptions;
  lang?: 'ru' | 'en' | 'uk';
  onSave?: (assumptions: Partial<PlanningAssumptions>) => void;
  editable?: boolean;
}

export function PlAssumptionsPanel({
  assumptions,
  lang: propLang,
  onSave,
  editable = false,
}: PlAssumptionsPanelProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(assumptions);

  const labels = {
    title: { ru: 'Допущения', en: 'Assumptions', uk: 'Припущення' },
    inflation: { ru: 'Инфляция', en: 'Inflation', uk: 'Інфляція' },
    returnPct: { ru: 'Ожидаемая доходность', en: 'Expected Return', uk: 'Очікувана доходність' },
    feeDrag: { ru: 'Комиссии и сборы', en: 'Fee Drag', uk: 'Комісії та збори' },
    horizonYears: { ru: 'Горизонт планирования', en: 'Planning Horizon', uk: 'Горизонт планування' },
    fxRates: { ru: 'Курсы валют (к USD)', en: 'FX Rates (to USD)', uk: 'Курси валют (до USD)' },
    assetReturns: { ru: 'Доходность по классам', en: 'Asset Class Returns', uk: 'Доходність за класами' },
    lastUpdated: { ru: 'Обновлено', en: 'Last Updated', uk: 'Оновлено' },
    staleWarning: { ru: 'Данные устарели (>30 дней)', en: 'Data is stale (>30 days)', uk: 'Дані застаріли (>30 днів)' },
    edit: { ru: 'Редактировать', en: 'Edit', uk: 'Редагувати' },
    save: { ru: 'Сохранить', en: 'Save', uk: 'Зберегти' },
    cancel: { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' },
    resetDefaults: { ru: 'По умолчанию', en: 'Reset Defaults', uk: 'За замовчуванням' },
    years: { ru: 'лет', en: 'years', uk: 'років' },
  };

  const assetClassLabels: Record<string, { ru: string; en: string; uk: string }> = {
    equity_us: { ru: 'Акции США', en: 'US Equity', uk: 'Акції США' },
    equity_intl: { ru: 'Межд. акции', en: 'Intl Equity', uk: 'Міжн. акції' },
    fixed_income: { ru: 'Облигации', en: 'Fixed Income', uk: 'Облігації' },
    real_estate: { ru: 'Недвижимость', en: 'Real Estate', uk: 'Нерухомість' },
    alternatives: { ru: 'Альтернативы', en: 'Alternatives', uk: 'Альтернативи' },
    cash: { ru: 'Кэш', en: 'Cash', uk: 'Кеш' },
  };

  const isStale = isAssumptionsStale(assumptions.updatedAt);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleSave = () => {
    onSave?.(editValues);
    setIsEditing(false);
  };

  const handleResetDefaults = () => {
    setEditValues({
      ...editValues,
      inflationPct: DEFAULT_ASSUMPTIONS.inflationPct,
      returnPct: DEFAULT_ASSUMPTIONS.returnPct,
      feeDragPct: DEFAULT_ASSUMPTIONS.feeDragPct,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          <h3 className="font-medium text-gray-900">{labels.title[lang]}</h3>
          {isStale && (
            <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
              ⚠️ {labels.staleWarning[lang]}
            </span>
          )}
        </div>
        {editable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {labels.edit[lang]}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Core assumptions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">{labels.inflation[lang]}</label>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                value={editValues.inflationPct}
                onChange={(e) => setEditValues({ ...editValues, inflationPct: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            ) : (
              <div className="font-medium">{assumptions.inflationPct}%</div>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">{labels.returnPct[lang]}</label>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                value={editValues.returnPct}
                onChange={(e) => setEditValues({ ...editValues, returnPct: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            ) : (
              <div className="font-medium">{assumptions.returnPct}%</div>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">{labels.feeDrag[lang]}</label>
            {isEditing ? (
              <input
                type="number"
                step="0.05"
                value={editValues.feeDragPct}
                onChange={(e) => setEditValues({ ...editValues, feeDragPct: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            ) : (
              <div className="font-medium">{assumptions.feeDragPct}%</div>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">{labels.horizonYears[lang]}</label>
            {isEditing ? (
              <input
                type="number"
                value={editValues.horizonYears}
                onChange={(e) => setEditValues({ ...editValues, horizonYears: parseInt(e.target.value) })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            ) : (
              <div className="font-medium">{assumptions.horizonYears} {labels.years[lang]}</div>
            )}
          </div>
        </div>

        {/* FX Rates */}
        <div>
          <label className="text-xs text-gray-500 block mb-2">{labels.fxRates[lang]}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(assumptions.fxRates).map(([currency, rate]) => (
              <div key={currency} className="px-2 py-1 bg-gray-100 rounded text-sm">
                <span className="font-medium">{currency}</span>
                <span className="text-gray-500 ml-1">{rate.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Class Returns */}
        <div>
          <label className="text-xs text-gray-500 block mb-2">{labels.assetReturns[lang]}</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(ASSET_CLASS_RETURNS).map(([key, value]) => (
              <div key={key} className="flex justify-between px-2 py-1 bg-gray-50 rounded text-sm">
                <span className="text-gray-600">{assetClassLabels[key]?.[lang] || key}</span>
                <span className="font-medium text-green-600">{(value * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last updated */}
        <div className="text-xs text-gray-400">
          {labels.lastUpdated[lang]}: {formatDate(assumptions.updatedAt)}
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="px-4 py-3 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleResetDefaults}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            {labels.resetDefaults[lang]}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditValues(assumptions);
                setIsEditing(false);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              {labels.cancel[lang]}
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {labels.save[lang]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

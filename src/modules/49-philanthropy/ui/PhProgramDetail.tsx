"use client";

import { PROGRAM_THEME_KEYS } from '../config';

interface PhilProgram {
  id: string;
  clientId: string;
  entityId?: string;
  entityName?: string;
  name: string;
  themeKey: keyof typeof PROGRAM_THEME_KEYS;
  ownerUserId?: string;
  ownerName?: string;
  status: 'active' | 'archived';
  goalsMarkdown?: string;
  criteriaJson?: { criterion: string; required: boolean }[];
  geoPrefsJson?: string[];
  exclusionsJson?: string[];
  kpiTargetsJson?: { metric: string; targetValue: number; unit: string }[];
  annualBudget?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

interface PhProgramDetailProps {
  program: PhilProgram;
  activeGrantsCount?: number;
  totalGranted?: number;
  onEdit?: () => void;
  onViewGrants?: () => void;
}

export function PhProgramDetail({
  program,
  activeGrantsCount = 0,
  totalGranted = 0,
  onEdit,
  onViewGrants,
}: PhProgramDetailProps) {
  const themeConfig = PROGRAM_THEME_KEYS[program.themeKey];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${themeConfig?.color || 'stone'}-100 text-${themeConfig?.color || 'stone'}-700`}>
                {themeConfig?.ru || program.themeKey}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                program.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
              }`}>
                {program.status === 'active' ? 'Активна' : 'Архив'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">{program.name}</h1>
            {program.entityName && (
              <p className="text-stone-500 mt-1">Структура: {program.entityName}</p>
            )}
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
            >
              Редактировать
            </button>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Бюджет</div>
            <div className="text-xl font-semibold text-stone-900 mt-1">
              {program.annualBudget ? formatCurrency(program.annualBudget, program.currency) : '—'}
            </div>
          </div>
          <button
            onClick={onViewGrants}
            className="bg-stone-50 rounded-lg p-4 text-left hover:bg-stone-100 transition-colors"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider">Активные гранты</div>
            <div className="text-xl font-semibold text-stone-900 mt-1">{activeGrantsCount}</div>
          </button>
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Всего выдано</div>
            <div className="text-xl font-semibold text-emerald-600 mt-1">
              {formatCurrency(totalGranted, program.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      {program.goalsMarkdown && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Цели программы</h2>
          <div className="prose prose-sm max-w-none text-stone-700">
            {program.goalsMarkdown}
          </div>
        </div>
      )}

      {/* Criteria */}
      {program.criteriaJson && program.criteriaJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Критерии отбора</h2>
          <ul className="space-y-2">
            {program.criteriaJson.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  item.required ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-600'
                }`}>
                  {item.required ? '!' : '•'}
                </span>
                <span className="text-stone-700">
                  {item.criterion}
                  {item.required && <span className="text-red-600 text-xs ml-1">(обязательно)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Geography preferences */}
      {program.geoPrefsJson && program.geoPrefsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Предпочтительные регионы</h2>
          <div className="flex flex-wrap gap-2">
            {program.geoPrefsJson.map((geo, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {geo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Exclusions */}
      {program.exclusionsJson && program.exclusionsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Исключения</h2>
          <ul className="space-y-1">
            {program.exclusionsJson.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-stone-600">
                <span className="text-red-500">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KPI Targets */}
      {program.kpiTargetsJson && program.kpiTargetsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Целевые KPI</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {program.kpiTargetsJson.map((kpi, idx) => (
              <div key={idx} className="bg-emerald-50 rounded-lg p-4">
                <div className="text-xs text-emerald-600 uppercase tracking-wider">{kpi.metric}</div>
                <div className="text-xl font-semibold text-emerald-800 mt-1">
                  {kpi.targetValue.toLocaleString('ru-RU')} <span className="text-sm font-normal">{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from 'react';
import { ArrowLeft, Play, GitBranch, Zap, FileText } from 'lucide-react';
import { LqStatusPill } from './LqStatusPill';
import { LqChartPanel } from './LqChartPanel';
import { LqFlowsTable } from './LqFlowsTable';
import { LqScenariosTable } from './LqScenariosTable';
import { LqStressTestsTable } from './LqStressTestsTable';
import { LqAlertsTable } from './LqAlertsTable';

interface CashForecast {
  id: string;
  name: string;
  scopeType: string;
  horizonDays: number;
  status: 'active' | 'draft' | 'archived';
  assumptionsJson?: {
    minCashThreshold?: number;
    includeRecurring?: boolean;
  };
  resultsJson?: {
    dailyBalances?: Array<{
      date: string;
      closingBalance: number;
      inflows: number;
      outflows: number;
    }>;
    minBalance?: number;
    minBalanceDate?: string;
    totalInflows?: number;
    totalOutflows?: number;
    deficitDays?: number;
    computedAt?: string;
  };
  asOf?: string;
  createdAt: string;
  updatedAt: string;
}

interface LqForecastDetailProps {
  forecast: CashForecast;
  flows?: Array<{
    id: string;
    flowType: 'inflow' | 'outflow';
    categoryKey: string;
    flowDate: string;
    amount: number;
    currency: string;
    description?: string;
    isConfirmed?: boolean;
  }>;
  scenarios?: Array<{
    id: string;
    name: string;
    scenarioType: 'base' | 'conservative' | 'aggressive' | 'custom';
    adjustmentsJson?: Record<string, unknown>;
    updatedAt: string;
  }>;
  stressTests?: Array<{
    id: string;
    name: string;
    stressType: string;
    paramsJson?: { severity?: string };
    resultsJson?: { minCashReached?: number; breachesCount?: number };
    runAt?: string;
  }>;
  alerts?: Array<{
    id: string;
    title?: string;
    forecastId: string;
    deficitDate: string;
    shortfallAmount: number;
    currency: string;
    severity: 'critical' | 'warning' | 'info';
    status: 'open' | 'acknowledged' | 'closed';
  }>;
  onBack: () => void;
  onCompute?: () => void;
  onAddScenario?: () => void;
  onRunStressTest?: () => void;
  onShowAudit?: () => void;
  onOpenScenario?: (id: string) => void;
  onOpenStressTest?: (id: string) => void;
  onOpenAlert?: (id: string) => void;
}

type TabKey = 'overview' | 'flows' | 'scenarios' | 'stress' | 'alerts' | 'audit';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function LqForecastDetail({
  forecast,
  flows = [],
  scenarios = [],
  stressTests = [],
  alerts = [],
  onBack,
  onCompute,
  onAddScenario,
  onRunStressTest,
  onShowAudit,
  onOpenScenario,
  onOpenStressTest,
  onOpenAlert,
}: LqForecastDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'flows', label: 'Потоки' },
    { key: 'scenarios', label: 'Сценарии' },
    { key: 'stress', label: 'Стресс-тесты' },
    { key: 'alerts', label: 'Алерты' },
    { key: 'audit', label: 'Аудит' },
  ];

  const results = forecast.resultsJson;
  const assumptions = forecast.assumptionsJson;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-stone-800">{forecast.name}</h1>
              <LqStatusPill status={forecast.status} />
            </div>
            <p className="text-sm text-stone-500 mt-1">
              {forecast.scopeType} · Горизонт {forecast.horizonDays} дней
              {forecast.asOf && ` · На ${formatDate(forecast.asOf)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onCompute && (
            <button
              onClick={onCompute}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Запустить расчёт</span>
            </button>
          )}
          {onAddScenario && (
            <button
              onClick={onAddScenario}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-sm">Сценарий</span>
            </button>
          )}
          {onRunStressTest && (
            <button
              onClick={onRunStressTest}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Стресс</span>
            </button>
          )}
          {onShowAudit && (
            <button
              onClick={onShowAudit}
              className="flex items-center gap-2 px-3 py-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
              {tab.key === 'alerts' && alerts.filter((a) => a.status === 'open').length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                  {alerts.filter((a) => a.status === 'open').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Results Summary */}
          {results ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <div className="text-xs text-stone-500 mb-1">Минимальный баланс</div>
                  <div className={`text-lg font-bold ${(results.minBalance || 0) < 0 ? 'text-red-600' : 'text-stone-800'}`}>
                    {formatCurrency(results.minBalance || 0)}
                  </div>
                  {results.minBalanceDate && (
                    <div className="text-xs text-stone-400 mt-1">
                      {formatDate(results.minBalanceDate)}
                    </div>
                  )}
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <div className="text-xs text-stone-500 mb-1">Всего притоки</div>
                  <div className="text-lg font-bold text-emerald-600">
                    {formatCurrency(results.totalInflows || 0)}
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <div className="text-xs text-stone-500 mb-1">Всего оттоки</div>
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(results.totalOutflows || 0)}
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <div className="text-xs text-stone-500 mb-1">Дней с дефицитом</div>
                  <div className={`text-lg font-bold ${(results.deficitDays || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {results.deficitDays || 0}
                  </div>
                </div>
              </div>

              {/* Chart */}
              {results.dailyBalances && results.dailyBalances.length > 0 && (
                <LqChartPanel
                  title="Прогноз баланса"
                  dailyBalances={results.dailyBalances}
                  minCashThreshold={assumptions?.minCashThreshold || 0}
                />
              )}
            </>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <p className="text-amber-700">
                Прогноз ещё не рассчитан. Нажмите "Запустить расчёт" для построения прогноза.
              </p>
            </div>
          )}

          {/* Assumptions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Допущения</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-stone-500">Порог кэша:</span>{' '}
                <span className="font-medium">{formatCurrency(assumptions?.minCashThreshold || 0)}</span>
              </div>
              <div>
                <span className="text-stone-500">Рекуррентные:</span>{' '}
                <span className="font-medium">{assumptions?.includeRecurring ? 'Да' : 'Нет'}</span>
              </div>
              {results?.computedAt && (
                <div>
                  <span className="text-stone-500">Расчёт от:</span>{' '}
                  <span className="font-medium">{formatDate(results.computedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'flows' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <LqFlowsTable flows={flows} flowType="all" />
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <LqScenariosTable
            scenarios={scenarios}
            onOpen={onOpenScenario || (() => {})}
          />
        </div>
      )}

      {activeTab === 'stress' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <LqStressTestsTable
            tests={stressTests}
            onOpen={onOpenStressTest || (() => {})}
          />
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <LqAlertsTable
            alerts={alerts}
            onOpen={onOpenAlert || (() => {})}
          />
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center text-stone-400">
          Audit trail будет отображён здесь
        </div>
      )}
    </div>
  );
}

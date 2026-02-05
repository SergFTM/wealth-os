'use client';

/**
 * Planning Dashboard Page Component
 * Main module landing page
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useScope } from '@/lib/store';
import { PlanningGoal } from '../schema/goal';
import { PlanningScenario } from '../schema/scenario';
import { LifeEvent } from '../schema/lifeEvent';
import { CashflowItem, getAnnualAmount } from '../schema/cashflowItem';
import { PlanActualLink } from '../schema/planActualLink';
import { PlanningRun } from '../schema/planningRun';
import { PlKpiStrip, buildPlanningKpis, PlanningKpiData } from './PlKpiStrip';
import { PlGoalsTable } from './PlGoalsTable';
import { PlScenariosTable } from './PlScenariosTable';
import { PlProjectionChart } from './PlProjectionChart';
import { PlActionsBar } from './PlActionsBar';

interface PlDashboardPageProps {
  lang?: 'ru' | 'en' | 'uk';
}

export function PlDashboardPage({ lang: propLang }: PlDashboardPageProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;
  const { scope } = useScope();

  const [goals, setGoals] = useState<PlanningGoal[]>([]);
  const [scenarios, setScenarios] = useState<PlanningScenario[]>([]);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [cashflows, setCashflows] = useState<CashflowItem[]>([]);
  const [planActual, setPlanActual] = useState<PlanActualLink[]>([]);
  const [latestRun, setLatestRun] = useState<PlanningRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (scope.type !== 'global') {
          params.set(scope.type === 'household' ? 'householdId' : scope.type === 'entity' ? 'entityId' : 'portfolioId', scope.id);
        }

        const [goalsRes, scenariosRes, eventsRes, cashflowsRes, planActualRes, runsRes] = await Promise.all([
          fetch(`/api/collections/goals?${params}`),
          fetch(`/api/collections/scenarios?${params}`),
          fetch(`/api/collections/lifeEvents?${params}`),
          fetch(`/api/collections/cashflowItems?${params}`),
          fetch(`/api/collections/planActualLinks?${params}`),
          fetch(`/api/collections/planningRuns?${params}&_sort=runDate&_order=desc&_limit=1`),
        ]);

        const [goalsData, scenariosData, eventsData, cashflowsData, planActualData, runsData] = await Promise.all([
          goalsRes.json(),
          scenariosRes.json(),
          eventsRes.json(),
          cashflowsRes.json(),
          planActualRes.json(),
          runsRes.json(),
        ]);

        setGoals(goalsData.data || []);
        setScenarios(scenariosData.data || []);
        setEvents(eventsData.data || []);
        setCashflows(cashflowsData.data || []);
        setPlanActual(planActualData.data || []);
        setLatestRun(runsData.data?.[0] || null);
      } catch (error) {
        console.error('Error loading planning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scope]);

  // Calculate KPI data
  const kpiData: PlanningKpiData = {
    activeGoals: goals.filter(g => g.status === 'active').length,
    totalGoalsAmount: goals.filter(g => g.status === 'active').reduce((sum, g) => sum + g.targetAmount, 0),
    fundedPct: goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.fundingRatio, 0) / goals.length)
      : 0,
    activeScenarios: scenarios.filter(s => s.isActive).length,
    horizonYears: latestRun?.horizonYears || 20,
    netCashflowAnnual: cashflows.reduce((sum, c) => {
      const annual = getAnnualAmount(c);
      return sum + (c.flowType === 'inflow' ? annual : -annual);
    }, 0),
    planVsActualPct: planActual.length > 0
      ? Math.round(planActual.reduce((sum, p) => sum + p.gapPct, 0) / planActual.length)
      : 0,
    upcomingEvents: events.filter(e => new Date(e.eventDate) > new Date()).length,
  };

  const labels = {
    title: { ru: 'Финансовое планирование', en: 'Financial Planning', uk: 'Фінансове планування' },
    subtitle: { ru: 'Цели, сценарии и прогноз капитала', en: 'Goals, scenarios and wealth projection', uk: 'Цілі, сценарії та прогноз капіталу' },
    disclaimer: {
      ru: 'Планирование носит информационный характер и требует проверки консультантом. Не является индивидуальной инвестиционной рекомендацией.',
      en: 'Planning is informational and requires advisor review. Not individual investment advice.',
      uk: 'Планування носить інформаційний характер і потребує перевірки консультантом. Не є індивідуальною інвестиційною рекомендацією.',
    },
    activeGoals: { ru: 'Активные цели', en: 'Active Goals', uk: 'Активні цілі' },
    activeScenarios: { ru: 'Активные сценарии', en: 'Active Scenarios', uk: 'Активні сценарії' },
    projection: { ru: 'Прогноз капитала', en: 'Net Worth Projection', uk: 'Прогноз капіталу' },
    viewAll: { ru: 'Все', en: 'View All', uk: 'Усі' },
    noData: { ru: 'Нет данных', en: 'No data', uk: 'Немає даних' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title[lang]}</h1>
        <p className="text-sm text-gray-500 mt-1">{labels.subtitle[lang]}</p>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        ⚠️ {labels.disclaimer[lang]}
      </div>

      {/* Actions */}
      <PlActionsBar
        lang={lang}
        onAddGoal={() => window.location.href = '/m/planning/list?tab=goals&action=new'}
        onAddScenario={() => window.location.href = '/m/planning/list?tab=scenarios&action=new'}
        onAddCashflow={() => window.location.href = '/m/planning/list?tab=cashflow&action=new'}
        onAddEvent={() => window.location.href = '/m/planning/list?tab=events&action=new'}
        onRunScenario={() => window.location.href = '/m/planning/list?tab=scenarios&action=run'}
      />

      {/* KPI Strip */}
      <PlKpiStrip kpis={buildPlanningKpis(kpiData)} lang={lang} />

      {/* Projection Chart */}
      {latestRun && latestRun.projections.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">{labels.projection[lang]}</h2>
            <Link
              href={`/m/planning/run/${latestRun.id}`}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {labels.viewAll[lang]} →
            </Link>
          </div>
          <PlProjectionChart projections={latestRun.projections} lang={lang} height={280} />
        </div>
      )}

      {/* Goals & Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Goals */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <span>🎯</span>
              {labels.activeGoals[lang]}
            </h2>
            <Link
              href="/m/planning/list?tab=goals"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {labels.viewAll[lang]} →
            </Link>
          </div>
          <div className="p-4">
            {goals.filter(g => g.status === 'active').length > 0 ? (
              <PlGoalsTable
                goals={goals.filter(g => g.status === 'active').slice(0, 5)}
                lang={lang}
              />
            ) : (
              <div className="text-center py-4 text-gray-500">{labels.noData[lang]}</div>
            )}
          </div>
        </div>

        {/* Active Scenarios */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <span>📊</span>
              {labels.activeScenarios[lang]}
            </h2>
            <Link
              href="/m/planning/list?tab=scenarios"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {labels.viewAll[lang]} →
            </Link>
          </div>
          <div className="p-4">
            {scenarios.filter(s => s.isActive).length > 0 ? (
              <PlScenariosTable
                scenarios={scenarios.filter(s => s.isActive).slice(0, 5)}
                lang={lang}
              />
            ) : (
              <div className="text-center py-4 text-gray-500">{labels.noData[lang]}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

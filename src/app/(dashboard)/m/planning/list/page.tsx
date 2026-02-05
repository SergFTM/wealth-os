'use client';

/**
 * Planning List Page with Tabs
 * /m/planning/list
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useScope } from '@/lib/store';
import { PlanningGoal } from '@/modules/26-planning/schema/goal';
import { PlanningScenario } from '@/modules/26-planning/schema/scenario';
import { LifeEvent } from '@/modules/26-planning/schema/lifeEvent';
import { CashflowItem } from '@/modules/26-planning/schema/cashflowItem';
import { PlanActualLink } from '@/modules/26-planning/schema/planActualLink';
import { PlanningAssumptions, DEFAULT_ASSUMPTIONS } from '@/modules/26-planning/schema/assumptions';
import {
  PlTabBar,
  PlActionsBar,
  PlGoalsTable,
  PlScenariosTable,
  PlCashflowTable,
  PlPlanVsActualTable,
  PlEventsCalendar,
  PlEventsStats,
  PlAssumptionsPanel,
} from '@/modules/26-planning/ui';

export default function PlanningListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useI18n();
  const { scope } = useScope();

  const initialTab = searchParams.get('tab') || 'goals';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [goals, setGoals] = useState<PlanningGoal[]>([]);
  const [scenarios, setScenarios] = useState<PlanningScenario[]>([]);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [cashflows, setCashflows] = useState<CashflowItem[]>([]);
  const [planActual, setPlanActual] = useState<PlanActualLink[]>([]);
  const [assumptions, setAssumptions] = useState<PlanningAssumptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (scope.type !== 'global') {
          params.set(scope.type === 'household' ? 'householdId' : scope.type === 'entity' ? 'entityId' : 'portfolioId', scope.id);
        }

        const [goalsRes, scenariosRes, eventsRes, cashflowsRes, planActualRes, assumptionsRes] = await Promise.all([
          fetch(`/api/collections/goals?${params}`),
          fetch(`/api/collections/scenarios?${params}`),
          fetch(`/api/collections/lifeEvents?${params}`),
          fetch(`/api/collections/cashflowItems?${params}`),
          fetch(`/api/collections/planActualLinks?${params}`),
          fetch(`/api/collections/assumptions?${params}&_limit=1`),
        ]);

        const [goalsData, scenariosData, eventsData, cashflowsData, planActualData, assumptionsData] = await Promise.all([
          goalsRes.json(),
          scenariosRes.json(),
          eventsRes.json(),
          cashflowsRes.json(),
          planActualRes.json(),
          assumptionsRes.json(),
        ]);

        setGoals(goalsData.data || []);
        setScenarios(scenariosData.data || []);
        setEvents(eventsData.data || []);
        setCashflows(cashflowsData.data || []);
        setPlanActual(planActualData.data || []);
        setAssumptions(assumptionsData.data?.[0] || {
          id: 'default',
          clientId: scope.type !== 'global' ? scope.id : 'global',
          ...DEFAULT_ASSUMPTIONS,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error loading planning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scope]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/m/planning/list?tab=${tab}`, { scroll: false });
  };

  const labels = {
    title: { ru: 'Планирование', en: 'Planning', uk: 'Планування' },
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
      </div>

      {/* Actions */}
      <PlActionsBar
        lang={lang}
        onAddGoal={() => alert('Add goal modal')}
        onAddScenario={() => alert('Add scenario modal')}
        onAddCashflow={() => alert('Add cashflow modal')}
        onAddEvent={() => alert('Add event modal')}
        onRunScenario={() => alert('Run scenario')}
      />

      {/* Tab Bar */}
      <PlTabBar activeTab={activeTab} onTabChange={handleTabChange} lang={lang} />

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {activeTab === 'goals' && (
          <PlGoalsTable
            goals={goals}
            lang={lang}
            onEdit={(id) => router.push(`/m/planning/goal/${id}`)}
          />
        )}

        {activeTab === 'scenarios' && (
          <PlScenariosTable
            scenarios={scenarios}
            lang={lang}
            onSelect={(id) => router.push(`/m/planning/scenario/${id}`)}
          />
        )}

        {activeTab === 'cashflow' && (
          <PlCashflowTable
            items={cashflows}
            lang={lang}
            onEdit={(id) => alert(`Edit cashflow ${id}`)}
          />
        )}

        {activeTab === 'planvsactual' && (
          <PlPlanVsActualTable
            links={planActual}
            lang={lang}
            onExplain={(id) => alert(`Explain gap ${id}`)}
            onViewDetails={(id) => alert(`View details ${id}`)}
          />
        )}

        {activeTab === 'events' && (
          <>
            <PlEventsStats events={events} lang={lang} />
            <PlEventsCalendar
              events={events}
              lang={lang}
              onEventClick={(id) => alert(`Event ${id}`)}
            />
          </>
        )}

        {activeTab === 'assumptions' && assumptions && (
          <PlAssumptionsPanel
            assumptions={assumptions}
            lang={lang}
            editable={true}
            onSave={(updates) => {
              console.log('Save assumptions:', updates);
              alert('Assumptions saved');
            }}
          />
        )}
      </div>
    </div>
  );
}

'use client';

/**
 * Planning Scenario Detail Page
 * /m/planning/scenario/[id]
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { PlanningScenario } from '@/modules/26-planning/schema/scenario';
import { PlanningRun } from '@/modules/26-planning/schema/planningRun';
import { PlScenarioDetail } from '@/modules/26-planning/ui';

export default function ScenarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useI18n();
  const id = params.id as string;

  const [scenario, setScenario] = useState<PlanningScenario | null>(null);
  const [latestRun, setLatestRun] = useState<PlanningRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [scenarioRes, runsRes] = await Promise.all([
          fetch(`/api/collections/scenarios/${id}`),
          fetch(`/api/collections/planningRuns?scenarioId=${id}&_sort=runDate&_order=desc&_limit=1`),
        ]);

        if (!scenarioRes.ok) throw new Error('Scenario not found');

        const [scenarioData, runsData] = await Promise.all([
          scenarioRes.json(),
          runsRes.json(),
        ]);

        setScenario(scenarioData.data);
        setLatestRun(runsData.data?.[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading scenario');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const labels = {
    back: { ru: '← Назад к сценариям', en: '← Back to Scenarios', uk: '← Назад до сценаріїв' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Сценарий не найден', en: 'Scenario not found', uk: 'Сценарій не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || labels.notFound[lang]}</div>
        <Link href="/m/planning/list?tab=scenarios" className="text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
      </div>
    );
  }

  const handleRunScenario = async () => {
    // In real app, this would trigger a calculation run
    alert('Running scenario calculation...');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/m/planning/list?tab=scenarios"
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        {labels.back[lang]}
      </Link>

      {/* Scenario Detail */}
      <PlScenarioDetail
        scenario={scenario}
        latestRun={latestRun || undefined}
        lang={lang}
        onEdit={() => alert('Edit modal')}
        onRunScenario={handleRunScenario}
      />
    </div>
  );
}

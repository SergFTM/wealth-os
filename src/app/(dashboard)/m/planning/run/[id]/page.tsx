'use client';

/**
 * Planning Run Detail Page
 * /m/planning/run/[id]
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { PlanningRun } from '@/modules/26-planning/schema/planningRun';
import { PlRunDetail } from '@/modules/26-planning/ui';

export default function RunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useI18n();
  const id = params.id as string;

  const [run, setRun] = useState<PlanningRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRun = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/planningRuns/${id}`);
        if (!res.ok) throw new Error('Run not found');
        const data = await res.json();
        setRun(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading run');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRun();
  }, [id]);

  const labels = {
    back: { ru: '← Назад к планированию', en: '← Back to Planning', uk: '← Назад до планування' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Расчёт не найден', en: 'Run not found', uk: 'Розрахунок не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || labels.notFound[lang]}</div>
        <Link href="/m/planning" className="text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
      </div>
    );
  }

  const handleRerun = async () => {
    alert('Rerunning calculation...');
  };

  const handleCompare = () => {
    router.push(`/m/planning/list?tab=scenarios&compare=${run.scenarioId}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/m/planning"
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        {labels.back[lang]}
      </Link>

      {/* Run Detail */}
      <PlRunDetail
        run={run}
        lang={lang}
        onRerun={handleRerun}
        onCompare={handleCompare}
      />
    </div>
  );
}

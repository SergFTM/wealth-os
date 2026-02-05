'use client';

/**
 * Data Quality Sync Job Detail Page
 * /m/data-quality/job/[id]
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqJobDetail } from '@/modules/27-data-quality/ui/DqJobDetail';
import { DqSyncJob } from '@/modules/27-data-quality/schema/dqSyncJob';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useI18n();
  const id = params.id as string;

  const [job, setJob] = useState<DqSyncJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/dqSyncJobs/${id}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        setJob(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading job');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleRetry = async () => {
    try {
      const now = new Date().toISOString();
      await fetch(`/api/collections/dqSyncJobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'running',
          updatedAt: now,
        }),
      });
      // Simulate retry
      setTimeout(async () => {
        const success = Math.random() > 0.3;
        await fetch(`/api/collections/dqSyncJobs/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: success ? 'success' : 'failed',
            lastRunAt: new Date().toISOString(),
            lastSuccessAt: success ? new Date().toISOString() : undefined,
            errorSnippet: success ? null : 'Connection timeout on retry',
            updatedAt: new Date().toISOString(),
          }),
        });
        window.location.reload();
      }, 2000);
      alert(lang === 'ru' ? 'Повторный запуск...' : 'Retrying...');
    } catch (err) {
      alert(lang === 'ru' ? 'Ошибка при повторе' : 'Error retrying');
    }
  };

  const handleCreateIncident = () => {
    alert(lang === 'ru' ? 'Создание инцидента (demo)' : 'Create incident (demo)');
  };

  const labels = {
    back: { ru: '← Назад к синхронизациям', en: '← Back to Sync Jobs', uk: '← Назад до синхронізацій' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Задача не найдена', en: 'Job not found', uk: 'Завдання не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || labels.notFound[lang]}</div>
        <Link href="/m/data-quality/list?tab=jobs" className="text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/m/data-quality/list?tab=jobs" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      <DqJobDetail
        job={job}
        lang={lang}
        onRetry={handleRetry}
        onCreateIncident={handleCreateIncident}
      />
    </div>
  );
}

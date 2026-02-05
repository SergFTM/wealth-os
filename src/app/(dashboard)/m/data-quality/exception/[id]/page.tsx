'use client';

/**
 * Data Quality Exception Detail Page
 * /m/data-quality/exception/[id]
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqExceptionDetail } from '@/modules/27-data-quality/ui/DqExceptionDetail';
import { DqException } from '@/modules/27-data-quality/schema/dqException';

export default function ExceptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useI18n();
  const id = params.id as string;

  const [exception, setException] = useState<DqException | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchException = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/dqExceptions/${id}`);
        if (!res.ok) throw new Error('Exception not found');
        const data = await res.json();
        setException(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading exception');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchException();
  }, [id]);

  const handleCreateTask = async () => {
    alert(lang === 'ru' ? 'Создание задачи (demo)' : 'Create task (demo)');
  };

  const handleResolve = async (reason: string) => {
    try {
      await fetch(`/api/collections/dqExceptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolutionReason: reason,
          resolvedAt: new Date().toISOString(),
        }),
      });
      router.push('/m/data-quality/list?tab=exceptions');
    } catch (err) {
      alert(lang === 'ru' ? 'Ошибка при решении' : 'Error resolving');
    }
  };

  const handleRerun = () => {
    alert(lang === 'ru' ? 'Перезапуск проверок (demo)' : 'Re-running checks (demo)');
  };

  const labels = {
    back: { ru: '← Назад к исключениям', en: '← Back to Exceptions', uk: '← Назад до винятків' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Исключение не найдено', en: 'Exception not found', uk: 'Виняток не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !exception) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || labels.notFound[lang]}</div>
        <Link href="/m/data-quality/list?tab=exceptions" className="text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/m/data-quality/list?tab=exceptions" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      <DqExceptionDetail
        exception={exception}
        lang={lang}
        onCreateTask={handleCreateTask}
        onResolve={handleResolve}
        onRerun={handleRerun}
      />
    </div>
  );
}

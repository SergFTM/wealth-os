'use client';

/**
 * Data Quality Conflict Detail Page
 * /m/data-quality/conflict/[id]
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqConflictDetail } from '@/modules/27-data-quality/ui/DqConflictDetail';
import { DqConflict } from '@/modules/27-data-quality/schema/dqConflict';

export default function ConflictDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useI18n();
  const id = params.id as string;

  const [conflict, setConflict] = useState<DqConflict | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConflict = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/dqConflicts/${id}`);
        if (!res.ok) throw new Error('Conflict not found');
        const data = await res.json();
        setConflict(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading conflict');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchConflict();
  }, [id]);

  const handleResolve = async (resolution: 'keep_left' | 'keep_right' | 'merge' | 'delete_both') => {
    try {
      await fetch(`/api/collections/dqConflicts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: resolution === 'merge' ? 'merged' : 'resolved',
          resolution,
          resolvedAt: new Date().toISOString(),
        }),
      });
      router.push('/m/data-quality/list?tab=conflicts');
    } catch (err) {
      alert(lang === 'ru' ? 'Ошибка при решении' : 'Error resolving');
    }
  };

  const labels = {
    back: { ru: '← Назад к конфликтам', en: '← Back to Conflicts', uk: '← Назад до конфліктів' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Конфликт не найден', en: 'Conflict not found', uk: 'Конфлікт не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !conflict) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || labels.notFound[lang]}</div>
        <Link href="/m/data-quality/list?tab=conflicts" className="text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/m/data-quality/list?tab=conflicts" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      <DqConflictDetail
        conflict={conflict}
        lang={lang}
        onResolve={handleResolve}
      />
    </div>
  );
}

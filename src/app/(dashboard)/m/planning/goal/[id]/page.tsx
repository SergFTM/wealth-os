'use client';

/**
 * Planning Goal Detail Page
 * /m/planning/goal/[id]
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { PlanningGoal } from '@/modules/26-planning/schema/goal';
import { PlGoalDetail } from '@/modules/26-planning/ui';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useI18n();
  const id = params.id as string;

  const [goal, setGoal] = useState<PlanningGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoal = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/goals/${id}`);
        if (!res.ok) throw new Error('Goal not found');
        const data = await res.json();
        setGoal(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading goal');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGoal();
  }, [id]);

  const labels = {
    back: { ru: '← Назад к целям', en: '← Back to Goals', uk: '← Назад до цілей' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Цель не найдена', en: 'Goal not found', uk: 'Ціль не знайдена' },
    deleteConfirm: { ru: 'Удалить эту цель?', en: 'Delete this goal?', uk: 'Видалити цю ціль?' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || labels.notFound[lang]}</div>
        <Link href="/m/planning/list?tab=goals" className="text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm(labels.deleteConfirm[lang])) return;

    try {
      await fetch(`/api/collections/goals/${id}`, { method: 'DELETE' });
      router.push('/m/planning/list?tab=goals');
    } catch (err) {
      alert('Error deleting goal');
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/m/planning/list?tab=goals"
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        {labels.back[lang]}
      </Link>

      {/* Goal Detail */}
      <PlGoalDetail
        goal={goal}
        lang={lang}
        onEdit={() => alert('Edit modal')}
        onDelete={handleDelete}
      />
    </div>
  );
}

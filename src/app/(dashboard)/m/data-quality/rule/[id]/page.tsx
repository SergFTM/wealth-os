'use client';

/**
 * Data Quality Rule Detail Page
 * /m/data-quality/rule/[id]
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqRuleDetail } from '@/modules/27-data-quality/ui/DqRuleDetail';
import { DqRule } from '@/modules/27-data-quality/schema/dqRule';

export default function RuleDetailPage() {
  const params = useParams();
  const { lang } = useI18n();
  const id = params.id as string;

  const [rule, setRule] = useState<DqRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRule = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/dqRules/${id}`);
        if (!res.ok) throw new Error('Rule not found');
        const data = await res.json();
        setRule(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading rule');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRule();
  }, [id]);

  const labels = {
    back: { ru: '← Назад к правилам', en: '← Back to Rules', uk: '← Назад до правил' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
    notFound: { ru: 'Правило не найдено', en: 'Rule not found', uk: 'Правило не знайдено' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{labels.loading[lang]}</div>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || labels.notFound[lang]}</div>
        <Link href="/m/data-quality/list?tab=rules" className="text-blue-600 hover:text-blue-700">
          {labels.back[lang]}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/m/data-quality/list?tab=rules" className="text-sm text-blue-600 hover:text-blue-700">
        {labels.back[lang]}
      </Link>

      <DqRuleDetail
        rule={rule}
        lang={lang}
        onRun={() => alert('Run rule')}
        onToggle={(active) => alert(`Toggle to ${active}`)}
        onEdit={() => alert('Edit rule')}
      />
    </div>
  );
}

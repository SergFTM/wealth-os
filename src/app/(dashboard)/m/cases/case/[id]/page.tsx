'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n, useTranslation } from '@/lib/i18n';
import { CsCaseDetail, CaseDetail } from '@/modules/36-cases/ui/CsCaseDetail';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang: locale } = useI18n();
  const t = useTranslation();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await fetch(`/api/collections/cases/${caseId}`);
        if (!response.ok) {
          throw new Error('Case not found');
        }
        const data = await response.json();
        setCaseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      fetchCase();
    }
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">
          {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500">
          {error || t('caseNotFound', { ru: 'Кейс не найден', en: 'Case not found', uk: 'Кейс не знайдено' })}
        </div>
        <button
          onClick={() => router.push('/m/cases')}
          className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50"
        >
          {t('backToCases', { ru: 'Вернуться к кейсам', en: 'Back to Cases', uk: 'Повернутися до кейсів' })}
        </button>
      </div>
    );
  }

  const handleAssign = () => {
    // Would open assign modal
    console.log('Assign case');
  };

  const handleStatusChange = () => {
    // Would open status change modal
    console.log('Change status');
  };

  const handleAddComment = () => {
    // Would open add comment modal
    console.log('Add comment');
  };

  const handleCreateTask = () => {
    // Would open create task modal
    console.log('Create task');
  };

  const handleLinkObject = () => {
    // Would open link object modal
    console.log('Link object');
  };

  const handleResolve = async () => {
    try {
      await fetch(`/api/collections/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
        }),
      });
      // Refresh case data
      const response = await fetch(`/api/collections/cases/${caseId}`);
      const data = await response.json();
      setCaseData(data);
    } catch (err) {
      console.error('Failed to resolve case', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <a href="/m/cases" className="hover:text-emerald-600">
          {t('cases', { ru: 'Кейсы', en: 'Cases', uk: 'Кейси' })}
        </a>
        <span>/</span>
        <span className="text-gray-900">{caseData.caseNumber}</span>
      </div>

      {/* Case Detail */}
      <CsCaseDetail
        caseData={caseData}
        locale={locale}
        onAssign={handleAssign}
        onStatusChange={handleStatusChange}
        onAddComment={handleAddComment}
        onCreateTask={handleCreateTask}
        onLinkObject={handleLinkObject}
        onResolve={handleResolve}
      />
    </div>
  );
}

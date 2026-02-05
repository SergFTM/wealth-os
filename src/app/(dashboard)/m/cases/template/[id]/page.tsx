'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n, useTranslation } from '@/lib/i18n';
import { CsTemplateDetail, TemplateDetail } from '@/modules/36-cases/ui/CsTemplateDetail';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang: locale } = useI18n();
  const t = useTranslation();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/collections/caseTemplates/${templateId}`);
        if (!response.ok) {
          throw new Error('Template not found');
        }
        const data = await response.json();
        setTemplate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">
          {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500">
          {error || t('templateNotFound', { ru: 'Шаблон не найден', en: 'Template not found', uk: 'Шаблон не знайдено' })}
        </div>
        <button
          onClick={() => router.push('/m/cases/list?tab=templates')}
          className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50"
        >
          {t('backToTemplates', { ru: 'Вернуться к шаблонам', en: 'Back to Templates', uk: 'Повернутися до шаблонів' })}
        </button>
      </div>
    );
  }

  const handleUseTemplate = () => {
    router.push(`/m/cases/list?action=create&template=${templateId}`);
  };

  const handleEdit = () => {
    // Would open edit modal
    console.log('Edit template');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <a href="/m/cases" className="hover:text-emerald-600">
          {t('cases', { ru: 'Кейсы', en: 'Cases', uk: 'Кейси' })}
        </a>
        <span>/</span>
        <a href="/m/cases/list?tab=templates" className="hover:text-emerald-600">
          {t('templates', { ru: 'Шаблоны', en: 'Templates', uk: 'Шаблони' })}
        </a>
        <span>/</span>
        <span className="text-gray-900">{template.name}</span>
      </div>

      {/* Template Detail */}
      <CsTemplateDetail
        template={template}
        locale={locale}
        onUseTemplate={handleUseTemplate}
        onEdit={handleEdit}
      />
    </div>
  );
}

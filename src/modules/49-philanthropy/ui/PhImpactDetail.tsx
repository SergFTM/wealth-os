"use client";

import { PhStatusPill } from './PhStatusPill';

interface ImpactMetrics {
  beneficiaries?: number;
  projectsCompleted?: number;
  geographies?: string[];
  customMetrics?: { name: string; value: number; unit: string }[];
}

interface PhilImpactReport {
  id: string;
  clientId: string;
  grantId: string;
  grantName?: string;
  granteeName?: string;
  entityId?: string;
  programId?: string;
  programName?: string;
  periodStart: string;
  periodEnd: string;
  statusKey: 'draft' | 'submitted' | 'published';
  narrativeMdRu?: string;
  narrativeMdEn?: string;
  narrativeMdUk?: string;
  metricsJson?: ImpactMetrics;
  clientSafePublished?: boolean;
  portalPublicationId?: string;
  attachmentDocIdsJson?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PhImpactDetailProps {
  report: PhilImpactReport;
  onEdit?: () => void;
  onSubmit?: () => void;
  onPublish?: () => void;
}

export function PhImpactDetail({
  report,
  onEdit,
  onSubmit,
  onPublish,
}: PhImpactDetailProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    const endDate = new Date(end).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    return `${startDate} — ${endDate}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PhStatusPill status={report.statusKey} type="impact" size="md" />
              {report.clientSafePublished && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  ✓ Опубликован на портале
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Impact Report
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
              <span>Период: {formatPeriod(report.periodStart, report.periodEnd)}</span>
              {report.granteeName && <span>Получатель: {report.granteeName}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {report.statusKey === 'draft' && onSubmit && (
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Подать отчет
              </button>
            )}
            {report.statusKey === 'submitted' && onPublish && (
              <button
                onClick={onPublish}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                Опубликовать на портале
              </button>
            )}
            {onEdit && report.statusKey !== 'published' && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
              >
                Редактировать
              </button>
            )}
          </div>
        </div>

        {/* Metrics summary */}
        {report.metricsJson && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-xs text-emerald-600 uppercase tracking-wider">Бенефициаров</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {report.metricsJson.beneficiaries?.toLocaleString('ru-RU') || '—'}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-blue-600 uppercase tracking-wider">Проектов</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {report.metricsJson.projectsCompleted || '—'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-xs text-purple-600 uppercase tracking-wider">Регионов</div>
              <div className="text-2xl font-bold text-purple-700 mt-1">
                {report.metricsJson.geographies?.length || '—'}
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-xs text-amber-600 uppercase tracking-wider">Метрик</div>
              <div className="text-2xl font-bold text-amber-700 mt-1">
                {report.metricsJson.customMetrics?.length || 0}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Narrative RU */}
      {report.narrativeMdRu && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-stone-800">Нарратив</h2>
            <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">RU</span>
          </div>
          <div className="prose prose-sm max-w-none text-stone-700">
            <div className="whitespace-pre-wrap">{report.narrativeMdRu}</div>
          </div>
        </div>
      )}

      {/* Narrative EN */}
      {report.narrativeMdEn && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-stone-800">Narrative</h2>
            <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">EN</span>
          </div>
          <div className="prose prose-sm max-w-none text-stone-700">
            <div className="whitespace-pre-wrap">{report.narrativeMdEn}</div>
          </div>
        </div>
      )}

      {/* Custom metrics */}
      {report.metricsJson?.customMetrics && report.metricsJson.customMetrics.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Дополнительные метрики</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {report.metricsJson.customMetrics.map((metric, idx) => (
              <div key={idx} className="bg-stone-50 rounded-lg p-4">
                <div className="text-xs text-stone-500 uppercase tracking-wider">{metric.name}</div>
                <div className="text-xl font-semibold text-stone-900 mt-1">
                  {metric.value.toLocaleString('ru-RU')} <span className="text-sm font-normal text-stone-500">{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geographies */}
      {report.metricsJson?.geographies && report.metricsJson.geographies.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">География охвата</h2>
          <div className="flex flex-wrap gap-2">
            {report.metricsJson.geographies.map((geo, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                {geo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      {report.attachmentDocIdsJson && report.attachmentDocIdsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Приложения</h2>
          <div className="text-stone-600">
            {report.attachmentDocIdsJson.length} документов прикреплено
          </div>
        </div>
      )}

      {/* Publication info */}
      {report.clientSafePublished && report.publishedAt && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-emerald-800">Опубликован на клиентском портале</div>
              <div className="text-sm text-emerald-600">{formatDate(report.publishedAt)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

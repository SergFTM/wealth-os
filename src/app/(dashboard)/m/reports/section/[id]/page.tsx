'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ReportSection, sectionTypeLabels, categoryLabels, defaultDisclaimers } from '@/modules/23-reports/schema/reportSection';

export default function SectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [section, setSection] = useState<ReportSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSection();
  }, [id]);

  const fetchSection = async () => {
    try {
      const res = await fetch(`/api/reports/sections/${id}`);
      if (res.ok) {
        setSection(await res.json());
      }
    } catch (error) {
      console.error('Error fetching section:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Секция не найдена</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            ← Назад
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{section.title}</h1>
          {section.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            section.isResolved
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {section.isResolved ? 'Разрешено' : 'Ожидает'}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            section.clientVisible
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {section.clientVisible ? 'Для клиентов' : 'Внутренний'}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Информация о секции</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Тип:</span>
              <span className="ml-2 text-gray-900">
                {sectionTypeLabels[section.sectionType]?.ru || section.sectionType}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Категория:</span>
              <span className="ml-2 text-gray-900">
                {categoryLabels[section.categoryKey]?.ru || section.categoryKey}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Режим:</span>
              <span className="ml-2 text-gray-900">
                {section.mode === 'auto' ? 'Автоматический' : 'Ручной'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Порядок:</span>
              <span className="ml-2 text-gray-900">{section.order}</span>
            </div>
            {section.asOf && (
              <div>
                <span className="text-gray-500">Данные на:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(section.asOf).toLocaleString('ru')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        {section.sourcesJson && section.sourcesJson.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Источники данных</h2>
            <div className="space-y-2">
              {section.sourcesJson.map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {source.label}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({source.moduleKey})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(source.asOf).toLocaleDateString('ru')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Sources Warning */}
        {section.missingSources && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">Недостаточно данных</span>
            </div>
            <p className="text-sm text-amber-600 mt-2">
              Проверьте наличие данных в модуле-источнике или переключите секцию в ручной режим.
            </p>
          </div>
        )}

        {/* Disclaimers */}
        {section.disclaimersJson && section.disclaimersJson.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Дисклеймеры</h2>
            <div className="space-y-2">
              {section.disclaimersJson.map((disclaimer, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">{disclaimer.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Preview */}
        {(section.contentJson || section.customContent) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Содержимое</h2>
            {section.customContent ? (
              <div className="prose prose-sm max-w-none text-gray-700">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {section.customContent}
                </pre>
              </div>
            ) : section.contentJson ? (
              <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(JSON.parse(section.contentJson), null, 2)}
              </pre>
            ) : null}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push(`/m/reports/pack/${section.packId}`)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Открыть пакет
          </button>
        </div>
      </div>
    </div>
  );
}

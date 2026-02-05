'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ReportTemplate, TemplateSectionConfig } from '@/modules/23-reports/schema/reportTemplate';
import { sectionTypeLabels, categoryLabels, CategoryKey } from '@/modules/23-reports/schema/reportSection';
import { packTypeLabels, PackType, PeriodType } from '@/modules/23-reports/schema/reportPack';

export default function TemplateBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';

  const [template, setTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    packType: 'executive',
    defaultPeriodType: 'quarterly',
    sections: [],
    isGlobal: true,
    isActive: true,
    version: 1,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchTemplate();
    }
  }, [id, isNew]);

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`/api/collections/reportTemplates/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTemplate(data);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isNew
        ? '/api/collections/reportTemplates'
        : `/api/collections/reportTemplates/${id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          createdBy: template.createdBy || 'usr-001',
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        router.push(`/m/reports/template/${saved.id}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection: TemplateSectionConfig = {
      sectionType: 'custom',
      title: 'Новая секция',
      order: (template.sections?.length || 0) + 1,
    };
    setTemplate({
      ...template,
      sections: [...(template.sections || []), newSection],
    });
  };

  const removeSection = (index: number) => {
    const sections = [...(template.sections || [])];
    sections.splice(index, 1);
    sections.forEach((s, i) => (s.order = i + 1));
    setTemplate({ ...template, sections });
  };

  const updateSection = (index: number, updates: Partial<TemplateSectionConfig>) => {
    const sections = [...(template.sections || [])];
    sections[index] = { ...sections[index], ...updates };
    setTemplate({ ...template, sections });
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
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
          <h1 className="text-2xl font-semibold text-gray-900">
            {isNew ? 'Новый шаблон' : 'Редактирование шаблона'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !template.name}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название шаблона
              </label>
              <input
                type="text"
                value={template.name || ''}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Введите название"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={template.description || ''}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Опишите шаблон"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип пакета
              </label>
              <select
                value={template.packType}
                onChange={(e) => setTemplate({ ...template, packType: e.target.value as PackType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {Object.entries(packTypeLabels).map(([key, labels]) => (
                  <option key={key} value={key}>{labels.ru}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Период по умолчанию
              </label>
              <select
                value={template.defaultPeriodType}
                onChange={(e) => setTemplate({ ...template, defaultPeriodType: e.target.value as PeriodType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="monthly">Ежемесячно</option>
                <option value="quarterly">Ежеквартально</option>
                <option value="annual">Ежегодно</option>
                <option value="custom">Произвольный</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Секции шаблона</h2>
            <button
              onClick={addSection}
              className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
            >
              + Добавить секцию
            </button>
          </div>

          {template.sections && template.sections.length > 0 ? (
            <div className="space-y-3">
              {template.sections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-500 w-6">{section.order}</span>
                  <select
                    value={section.sectionType}
                    onChange={(e) => updateSection(index, {
                      sectionType: e.target.value as keyof typeof sectionTypeLabels,
                      title: sectionTypeLabels[e.target.value as keyof typeof sectionTypeLabels]?.ru || section.title
                    })}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                  >
                    {Object.entries(sectionTypeLabels).map(([key, labels]) => (
                      <option key={key} value={key}>{labels.ru}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(index, { title: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                    placeholder="Название"
                  />
                  <button
                    onClick={() => removeSection(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              Нет секций. Нажмите &quot;Добавить секцию&quot; чтобы начать.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

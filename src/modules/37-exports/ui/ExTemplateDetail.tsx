'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Edit, Star, Shield, FileText } from 'lucide-react';

interface PackSection {
  sectionId: string;
  enabled: boolean;
  label?: string;
  filters?: Record<string, unknown>;
  columns?: string[];
  format?: 'csv' | 'pdf';
}

interface ExTemplateDetailProps {
  template: {
    id: string;
    name: string;
    description?: string;
    defaultPackType: 'audit' | 'tax' | 'bank' | 'ops';
    defaultClientSafe: boolean;
    sectionsJson: PackSection[];
    isSystem: boolean;
    category?: string;
    createdBy?: string;
    createdAt: string;
    updatedAt?: string;
  };
  onApply: () => void;
  onEdit: () => void;
}

const PACK_TYPE_LABELS: Record<string, string> = {
  audit: 'Audit Pack',
  tax: 'Tax Advisor Pack',
  bank: 'Bank KYC Pack',
  ops: 'Operations Pack',
};

const SECTION_LABELS: Record<string, string> = {
  gl_journal: 'GL Journal',
  net_worth: 'Net Worth Snapshot',
  positions: 'Positions',
  private_capital: 'Private Capital Schedule',
  payments: 'Payments Summary',
  documents: 'Documents Index',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function ExTemplateDetail({ template, onApply, onEdit }: ExTemplateDetailProps) {
  const enabledSections = template.sectionsJson?.filter((s) => s.enabled) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/m/exports/list?tab=templates"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            {template.isSystem && (
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            )}
            {template.name}
          </h1>
          <p className="text-gray-500 mt-1">
            {template.category || 'Пользовательский шаблон'}
            {template.isSystem && (
              <span className="ml-2 text-amber-600">• Системный шаблон</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!template.isSystem && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Редактировать
            </button>
          )}
          <button
            onClick={onApply}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
          >
            <Copy className="w-4 h-4" />
            Создать пакет из шаблона
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4">Описание</h2>
            <p className="text-gray-600">
              {template.description || 'Описание не указано.'}
            </p>
          </div>

          {/* Sections */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Секции ({enabledSections.length})
            </h2>
            <div className="space-y-2">
              {template.sectionsJson?.map((section) => (
                <div
                  key={section.sectionId}
                  className={`p-3 rounded-lg border ${
                    section.enabled
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-gray-50 border-gray-100 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {section.label || SECTION_LABELS[section.sectionId] || section.sectionId}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 uppercase">
                        {section.format || 'csv'}
                      </span>
                      {section.enabled ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Properties */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4">Свойства</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Тип по умолчанию</label>
                <p className="font-medium text-gray-900">
                  {PACK_TYPE_LABELS[template.defaultPackType]}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Client-safe</label>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  {template.defaultClientSafe ? (
                    <>
                      <Shield className="w-4 h-4 text-emerald-500" />
                      Да
                    </>
                  ) : (
                    'Нет'
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Категория</label>
                <p className="font-medium text-gray-900">{template.category || '—'}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4">Метаданные</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Создан</span>
                <span className="text-gray-900">{formatDate(template.createdAt)}</span>
              </div>
              {template.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Изменён</span>
                  <span className="text-gray-900">{formatDate(template.updatedAt)}</span>
                </div>
              )}
              {template.createdBy && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Автор</span>
                  <span className="text-gray-900">{template.createdBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExTemplateDetail;

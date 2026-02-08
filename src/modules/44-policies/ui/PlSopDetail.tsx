"use client";

import { useState } from 'react';
import { PlStatusPill } from './PlStatusPill';
import { PlAiPanel } from './PlAiPanel';
import { PlVersionsTable } from './PlVersionsTable';
import { PlChecklistsTable } from './PlChecklistsTable';
import { SopProcessLabels, SopProcessKey } from '../config';
import { Button } from '@/components/ui/Button';

interface SopStep {
  orderIndex: number;
  title: string;
  description?: string;
  responsibleRole?: string;
  estimatedMinutes?: number;
}

interface Sop {
  id: string;
  title: string;
  processKey: SopProcessKey;
  status: string;
  currentVersionId?: string;
  currentVersionLabel?: string;
  stepsJson?: SopStep[];
  bodyMdRu: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  clientSafePublished: boolean;
  ownerUserId?: string;
  ownerName?: string;
  linkedPolicyId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlSopDetailProps {
  sop: Sop;
  versions?: Array<{
    id: string;
    docType: 'policy' | 'sop';
    docTitle: string;
    versionLabel: string;
    status: string;
    createdByName?: string;
    publishedAt?: string;
    createdAt: string;
  }>;
  checklists?: Array<{
    id: string;
    name: string;
    linkedSopId?: string;
    linkedSopTitle?: string;
    stepsJson: Array<{ orderIndex: number; title: string }>;
    usageCount: number;
    lastUsedAt?: string;
    createdAt: string;
  }>;
  onCreateVersion?: () => void;
  onGenerateChecklist?: (steps: Array<{ orderIndex: number; title: string }>) => void;
  onExportPdf?: () => void;
}

type TabKey = 'overview' | 'steps' | 'content' | 'versions' | 'checklists';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Обзор' },
  { key: 'steps', label: 'Шаги' },
  { key: 'content', label: 'Содержание' },
  { key: 'versions', label: 'Версии' },
  { key: 'checklists', label: 'Чеклисты' },
];

export function PlSopDetail({
  sop,
  versions = [],
  checklists = [],
  onCreateVersion,
  onGenerateChecklist,
  onExportPdf,
}: PlSopDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleChecklistGenerated = (steps: Array<{ orderIndex: number; title: string }>) => {
    if (onGenerateChecklist) {
      onGenerateChecklist(steps);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{sop.title}</h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm px-3 py-1">
                {SopProcessLabels[sop.processKey]?.ru || sop.processKey}
              </span>
              <PlStatusPill status={sop.status} size="md" />
              {sop.currentVersionLabel && (
                <span className="font-mono text-sm text-stone-600">{sop.currentVersionLabel}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {sop.clientSafePublished && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full border border-emerald-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Client-safe
              </span>
            )}
            {onExportPdf && (
              <Button variant="ghost" onClick={onExportPdf}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-stone-500">Владелец:</span>
            <div className="font-medium text-stone-800">
              {sop.ownerName || <span className="text-amber-600">Не назначен</span>}
            </div>
          </div>
          <div>
            <span className="text-stone-500">Шагов:</span>
            <div className="font-medium text-stone-800">{sop.stepsJson?.length || 0}</div>
          </div>
          <div>
            <span className="text-stone-500">Создан:</span>
            <div className="font-medium text-stone-800">{formatDate(sop.createdAt)}</div>
          </div>
          <div>
            <span className="text-stone-500">Обновлен:</span>
            <div className="font-medium text-stone-800">{formatDate(sop.updatedAt)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-stone-200'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Краткое описание</h3>
              <div className="prose prose-stone prose-sm max-w-none">
                {sop.bodyMdRu ? (
                  <div className="whitespace-pre-wrap">{sop.bodyMdRu.slice(0, 500)}...</div>
                ) : (
                  <p className="text-stone-500">Содержание не заполнено</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Шаги процедуры</h3>
              {sop.stepsJson && sop.stepsJson.length > 0 ? (
                <div className="space-y-4">
                  {sop.stepsJson.map((step) => (
                    <div
                      key={step.orderIndex}
                      className="flex gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {step.orderIndex}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800">{step.title}</h4>
                        {step.description && (
                          <p className="text-sm text-stone-600 mt-1">{step.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                          {step.responsibleRole && (
                            <span>Ответственный: {step.responsibleRole}</span>
                          )}
                          {step.estimatedMinutes && (
                            <span>~{step.estimatedMinutes} мин</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500">Шаги не определены</p>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Полное содержание</h3>
              <div className="whitespace-pre-wrap font-mono text-sm bg-stone-50 p-4 rounded-lg border border-stone-200 max-h-[600px] overflow-auto">
                {sop.bodyMdRu || 'Содержание не заполнено'}
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">История версий</h3>
                {onCreateVersion && (
                  <button
                    onClick={onCreateVersion}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    + Новая версия
                  </button>
                )}
              </div>
              <PlVersionsTable versions={versions} />
            </div>
          )}

          {activeTab === 'checklists' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">Чеклисты из этого SOP</h3>
              </div>
              <PlChecklistsTable checklists={checklists} />
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <PlAiPanel
            content={sop.bodyMdRu || ''}
            title={sop.title}
            locale="ru"
            onChecklistGenerated={handleChecklistGenerated}
          />
        </div>
      </div>
    </div>
  );
}
